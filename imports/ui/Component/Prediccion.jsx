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

export class Prediccion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      epoch_loss: [],
      //  val_train_x: [],
      val_train_y: [],
      val_unseen_x: [],
      val_unseen_y: [],
      timestamps_e: [],
      pred_y: [],
      layout: {
        //title: "Create a Static Chart",
        autosize: false,
        width: 1000,
        height: 500,
        showlegend: true
      }
    };
    this.onClickPredict = this.onClickPredict.bind(this);
    //this.callback = this.callback.bind(this);
  }
  getSerie() {
    return this.props.events.map(event => ({
      x: event.createdAt,
      y: event.message
    }));
  }

  onClickPredict() {
    let sma_vec = this.props.vectorSMA;
    let data_raw = this.props.events;
    let data_temporal_resolutions = "Weekly";
    let inputs = sma_vec.map(function(inp_f) {
      return inp_f["set"].map(function(val) {
        return parseFloat(val["y"]);
      });
    });
    let pred_X = [inputs[inputs.length - 1]];
    pred_X = pred_X.slice(
      Math.floor((this.props.trainingsize / 100) * pred_X.length),
      pred_X.length
    );
    let pred_y = this.makePredictions(pred_X, this.props.model["model"]);

    //window_size = parseInt(document.getElementById("input_windowsize").value);
    let window_size = this.props.const_window_size;
    let timestamps_d = data_raw
      .map(function(val) {
        return val["createdAt"];
      })
      .splice(data_raw.length - window_size, data_raw.length);

    // date
    console.log(timestamps_d);
    let last_date = new Date(timestamps_d[0]);
    console.log("timestamps_d[0] ", timestamps_d[0]);
    console.log("new Date(timestamps_d[0]) ", last_date);
    let add_days = 2;
    console.log("last_date antes ", last_date);
    last_date.setDate(last_date.getDate() + add_days);
    console.log("last_date despues ", last_date);
    let next_date = this.formatDate(last_date.toString());
    //console.log("next_date", next_date);
    let timestamps_e = [next_date];
    this.setState({ timestamps_e: timestamps_e, pred_y: pred_y });
    //console.log("timestamps_e: ", timestamps_e);
    //  console.log("pred_y: ", pred_y);
    //let graph_plot = document.getElementById('div_prediction_graph');
    //Plotly.newPlot( graph_plot, [{ x: timestamps_d, y: pred_X[0], name: "Latest Trends" }], { margin: { t: 0 } } );
    //Plotly.plot( graph_plot, [{ x: timestamps_e, y: pred_y, name: "Predicted Price" }], { margin: { t: 0 } } );
  }
  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
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
  renderPlot() {
    var real = {
      type: "scatter",
      mode: "lines",
      name: "Real",
      x: this.props.events.map(function(evento) {
        return evento.createdAt;
      }),
      y: this.props.events.map(function(evento) {
        return parseFloat(evento.message);
      }),
      line: { color: "#17BECF" }
    };
    var prediccion = {
      type: "scatter",
      mode: "scatter",
      name: "Valor de Predicción",
      x: this.state.timestamps_e,
      y: this.state.pred_y,
      line: { color: "red" }
    };

    var data = [real, prediccion];

    //  console.log(entrenamiento);
    return (
      <Plot
        data={data}
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
    //console.log(this.getSerie());

    //console.log(this.getSerie());
    //console.log(array);
    return (
      <Segment.Group raised>
        <Segment raised color="teal">
          <Header as="h4" dividing>
            <Icon name="bullseye" />
            <Header.Content>
              Predicción
              <Header.Subheader />
            </Header.Content>
          </Header>
          <center>{this.renderPlot()}</center>
        </Segment>

        <Segment textAlign="center">
          <Button.Group labeled icon color="violet" inverted>
            <Button
              icon="play"
              content="GENERAR PREDICCIÓN"
              //onClick={e => this.clickGenerar(e)}
              onClick={this.onClickPredict.bind(this)}
            />
          </Button.Group>
        </Segment>
      </Segment.Group>
    );
  }
  makePredictions(X, model) {
    const predictedResults = model
      .predict(tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10)))
      .mul(10);
    return Array.from(predictedResults.dataSync());
  }
}

export default withTracker(
  ({
    sensorCodigo,
    eventos,
    tag,
    limite,
    const_window_size,
    model,
    vectorSMA,
    trainingsize
  }) => {
    //console.log(vectorSMA);
    return {
      events: eventos,
      const_window_size: const_window_size,
      model: model,
      trainingsize: trainingsize,
      vectorSMA: vectorSMA
      //    isLoading: isLoading
    };
  }
)(Prediccion);
