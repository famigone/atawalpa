import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { updateLocacion } from "/api/methods.js";
import { insertSensor } from "/api/methods.js";
import Sensors from "/imports/api/sensors.js";
import Events from "/imports/api/events.js";
import { Doughnut, Bar, Line, Scatter } from "react-chartjs-2";
import LoaderExampleText from "/imports/ui/Component/LoaderExampleText.js";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import Plot from "react-plotly.js";
import {
  Icon,
  Label,
  Menu,
  List,
  Progress,
  Message,
  Table,
  Segment,
  Button,
  Divider,
  Form,
  Grid,
  Dropdown,
  Modal,
  Header
} from "semantic-ui-react";

export class Entrenamiento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      epoch_loss: [],
      layout: {
        //title: "Create a Static Chart",
        autosize: false,
        width: 1000,
        height: 500,
        showlegend: false
      }
    };
    this.clickGenerar = this.clickGenerar.bind(this);
    this.callback = this.callback.bind(this);
  }

  getDataConfig() {
    const data = {
      datasets: [
        {
          label: this.props.sensorCodigo,
          //backgroundColor: ["rgba(0,251, 105, 4 )"],
          borderColor: "red",
          backgroundColor: "red",
          fill: false,
          //label: {this.props.sensorCodigo},
          borderColor: "red",
          data: this.getSerie()
        },
        {
          label: "MMS",
          //backgroundColor: ["rgba(0,251, 105, 4 )"],
          borderColor: "blue",
          backgroundColor: "blue",
          fill: false,
          //label: {this.props.sensorCodigo},
          borderColor: "blue",
          data: this.ComputeSMA(this.getSerie(), this.props.const_window_size)
        }
      ]

      // These labels appear in the legend and in the tooltips when hovering different arcs
    };
    return data;
  }
  getDataOptions() {
    var dataOptions = {
      maintainAspectRatio: true,
      scales: {
        xAxes: [
          {
            type: "time",
            position: "bottom"
          }
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true

              //stepValue: 20
              //max: 2000
            }
          }
        ]
      }
    };
    return dataOptions;
  }

  trainModel(
    inputs,
    outputs,
    trainingsize,
    window_size,
    n_epochs,
    learning_rate,
    n_layers,
    callback
  ) {
    const input_layer_shape = window_size;
    const input_layer_neurons = 100;

    //aca debería decir 1 uno, pero si pongo 2 pincha
    const rnn_input_layer_features = 2;
    const rnn_input_layer_timesteps =
      input_layer_neurons / rnn_input_layer_features;

    const rnn_input_shape = [
      rnn_input_layer_features,
      rnn_input_layer_timesteps
    ];
    const rnn_output_neurons = 20;

    const rnn_batch_size = window_size;

    const output_layer_shape = rnn_output_neurons;
    const output_layer_neurons = 1;

    const model = tf.sequential();

    let X = inputs.slice(0, Math.floor((trainingsize / 100) * inputs.length));
    let Y = outputs.slice(0, Math.floor((trainingsize / 100) * outputs.length));
    //  console.log(X);
    //console.log(Y);
    const xs = tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10));
    const ys = tf
      .tensor2d(Y, [Y.length, 1])
      .reshape([Y.length, 1])
      .div(tf.scalar(10));

    model.add(
      tf.layers.dense({
        units: input_layer_neurons,
        inputShape: [input_layer_shape]
      })
    );
    model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));

    let lstm_cells = [];
    for (let index = 0; index < n_layers; index++) {
      lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
    }

    model.add(
      tf.layers.rnn({
        cell: lstm_cells,
        inputShape: rnn_input_shape,
        returnSequences: false
      })
    );

    model.add(
      tf.layers.dense({
        units: output_layer_neurons,
        inputShape: [output_layer_shape]
      })
    );

    model.compile({
      optimizer: tf.train.adam(learning_rate),
      loss: "meanSquaredError"
    });

    const hist = model.fit(xs, ys, {
      batchSize: rnn_batch_size,
      epochs: n_epochs,
      callbacks: {
        onEpochEnd: async (epoch, log) => {
          callback(epoch, log);
        }
      }
    });

    return { model: model, stats: hist };
  }

  renderPerdida() {
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" }
          },
          {
            x: [2, 1, 5],
            y: [3, 3, 5],
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" }
          }
        ]}
        //layout={{width: 320, height: 240, title: 'A Fancy Plot'}}
      />
    );
  }
  ComputeSMAforEntrenamiento(data, window_size) {
    let r_avgs = [],
      avg_prev = 0;
    for (let i = 0; i <= data.length - window_size; i++) {
      let curr_avg = 0.0,
        t = i + window_size;
      for (let k = i; k < t && k <= data.length; k++) {
        curr_avg += data[k]["y"] / window_size;
      }
      r_avgs.push({
        set: data.slice(i, i + window_size),
        avg: parseFloat(curr_avg)
      });
      avg_prev = curr_avg;
    }
    //console.log(r_avgs);
    return r_avgs;
  }

  getSerie() {
    return this.props.events.map(event => ({
      x: event.createdAt,
      y: event.message
    }));
  }

  callback(epoch, log) {
    let epoch_loss = this.state.epoch_loss;
    epoch_loss.push(log.loss);
    this.setState({ epoch_loss: epoch_loss });
    console.log(this.state.epoch_loss);
  }

  clickGenerar() {
    let data = this.getSerie();
    let sma_vec = this.ComputeSMAforEntrenamiento(
      data,
      this.props.const_window_size
    );

    let inputs = sma_vec.map(function(inp_f) {
      return inp_f["set"].map(function(val) {
        return parseFloat(val["y"]);
      });
    });
    let outputs = sma_vec.map(function(outp_f) {
      return outp_f["avg"];
    });

    let trainingsize = 70;
    let n_epochs = 50;
    let learningrate = 0.01;
    let n_hiddenlayers = 1;

    let result = this.trainModel(
      inputs,
      outputs,
      trainingsize,
      this.props.const_window_size,
      n_epochs,
      learningrate,
      n_hiddenlayers,
      this.callback
    );
    return result;
  }

  getY() {
    var Y = [];
    for (let k = 0; k <= this.state.epoch_loss.length; k++) {
      Y[k] = k;
    }
    return Y;
  }

  getDatax() {
    var laData = [
      {
        x: this.getY(),
        y: this.state.epoch_loss,
        type: "lines",
        mode: "lines",
        marker: { color: "red" }
      }
    ];
    console.log(this.state.epoch_loss.length);
    return (
      <Plot
        data={laData}
        layout={this.state.layout}
        //frames={this.state.frames}
        //config={this.state.config}
        //  onInitialized={figure => this.setState(figure)}
        //  onUpdate={figure => this.setState(figure)}
      />
    );
  }

  render() {
    //console.log(this.props.const_window_size);
    if (this.props.isLoading) {
      return <LoaderExampleText />;
    }

    //let ray = this.getDatax();
    //console.log(this.getSerie());
    //let array = this.ComputeSMA(this.getSerie(), this.props.const_window_size);
    //console.log(this.getSerie());
    //console.log(array);
    return (
      <Segment.Group raised>
        <Segment raised>
          <Header as="h4" dividing>
            <Icon name="chart area" />
            <Header.Content>
              Entrenamiento
              <Header.Subheader />
            </Header.Content>
          </Header>
          <center>{this.getDatax()}</center>
        </Segment>
        <Segment textAlign="center">
          <Progress
            percent={(this.state.epoch_loss.length * 100) / 50}
            progress
            indicating
          />
        </Segment>
        <Segment textAlign="center">
          <Button.Group labeled icon color="violet" inverted>
            <Button
              icon="play"
              content="ENTRENAR MODELO"
              //onClick={e => this.clickGenerar(e)}
              onClick={this.clickGenerar.bind(this)}
            />
          </Button.Group>
        </Segment>
      </Segment.Group>
    );
  }
}

export default withTracker(
  ({ sensorCodigo, tag, limite, const_window_size }) => {
    //const handles = [Meteor.subscribe("eventsOne", sensorCodigo)];
    //console.log("sensorCodigo " + sensorCodigo + " tag " + tag);
    filtro = tag + "/" + sensorCodigo;
    //const handles = [Meteor.subscribe("eventsOne", filtro)];
    const handles = [Meteor.subscribe("eventsOneLimit", filtro)];
    var isLoading = handles.some(handle => !handle.ready());
    //const elSensor = Sensors.findOne(sensorid);

    return {
      events: Events.find(
        { topic: filtro },
        {
          sort: { createdAt: -1 },
          limit: limite
        }
      ).fetch(),
      const_window_size: const_window_size,
      isLoading: isLoading
    };
  }
)(Entrenamiento);
