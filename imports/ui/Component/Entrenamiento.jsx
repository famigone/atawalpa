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
import ModalForm from "/imports/ui/Component/modalform.jsx";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import MiMessage from "/imports/ui/Component/MiMessage.jsx";
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
      modalOpen: false,
      visible: false,
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
    this.trainModel = this.trainModel.bind(this);
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
    const const_future_steps = 10;
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
    this.props.setModel(model);
    return { model: model, stats: hist };
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
    //this.props.setModel(result);
    //  console.log(this.state.epoch_loss);
  }
  getSerie() {
    return this.props.eventsMMS.map(event => ({
      x: event.createdAt,
      y: event.message
    }));
  }
  ComputeSMA(data, window_size) {
    //console.log("data", data);
    let r_avgs = [],
      avg_prev = 0,
      x = 0;
    const const_future_steps = 10;
    for (let i = data.length; i > window_size + const_future_steps; i--) {
      x = i - window_size - const_future_steps + 1;

      r_avgs.push({
        set: data.slice(i - window_size, i),
        y: parseFloat(data[x]["y"])
      });
    }
    //console.log("r_avgs", r_avgs);

    return r_avgs;
  }

  clickGenerar() {
    //console.log(data);
    // aca sale NaN
    let sma_vec = this.ComputeSMA(
      this.getSerie(),
      this.props.const_window_size
    );
    this.props.setTensor(sma_vec);
    let inputs = sma_vec.map(function(inp_f) {
      return inp_f["set"].map(function(val) {
        return parseFloat(val["y"]);
      });
    });

    let outputs = sma_vec.map(function(outp_f) {
      return outp_f["y"];
    });

    let trainingsize = this.props.trainingsize;

    let n_epochs = this.props.n_epochs;
    let learningrate = this.props.learningrate;
    let n_hiddenlayers = this.props.n_hiddenlayers;

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
        marker: { color: "green" }
      }
    ];
    //console.log(this.state.epoch_loss.length);
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
    return (
      <Segment.Group raised>
        <Segment raised>
          <Header as="h4" dividing>
            <Icon name="sync" />
            <Header.Content>
              Entrenamiento
              <Header.Subheader />
            </Header.Content>
          </Header>
          <center>{this.getDatax()}</center>
        </Segment>
        <Segment textAlign="center">
          <Progress
            percent={(this.state.epoch_loss.length * 100) / this.props.n_epochs}
            progress
            //indicating
            color={"teal"}
          />
        </Segment>
        <ModalForm />
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
  ({
    sensorCodigo,
    tag,
    limite,
    const_window_size,
    setModel,
    eventos,
    //tensor,
    trainingsize,
    n_epochs,
    learningrate,
    n_hiddenlayers,
    eventsMMS,
    setTensor
  }) => {
    return {
      events: eventos,
      setModel: setModel,
      const_window_size: const_window_size,
      //  tensor: tensor,
      trainingsize: trainingsize,
      n_epochs: n_epochs,
      learningrate: learningrate,
      n_hiddenlayers: n_hiddenlayers,
      eventsMMS: eventsMMS,
      setTensor: setTensor
    };
  }
)(Entrenamiento);
