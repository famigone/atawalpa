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

export class Validacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      epoch_loss: [],
      //  val_train_x: [],
      val_train_y: [],
      val_unseen_x: [],
      val_unseen_y: [],
      layout: {
        //title: "Create a Static Chart",
        autosize: false,
        width: 1000,
        height: 500,
        showlegend: true
      }
    };
    this.onClickValidate = this.onClickValidate.bind(this);
    //this.callback = this.callback.bind(this);
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

    var eventosDesdeVentana = this.props.events.slice(
      this.desdeEntrenamiento(),
      this.hastaEntrenamiento()
    );

    var eventosValidacion = this.props.events.slice(
      this.desdeValidacion(),
      this.hastaValidacion()
    );

    var entrenamiento = {
      type: "scatter",
      mode: "lines",
      name: "Entrenamiento",
      x: eventosDesdeVentana.map(function(evento) {
        return evento.createdAt;
      }),
      y: this.state.val_train_y,
      line: { color: "#7F7F7F" }
    };

    var validacion = {
      type: "scatter",
      mode: "lines",
      name: "Validación",
      x: eventosValidacion.map(function(evento) {
        return evento.createdAt;
      }),
      y: this.state.val_unseen_y,
      line: { color: "blue" }
    };

    var data = [real, entrenamiento, validacion];

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

  desdeEntrenamiento() {
    return (
      //this.props.events.length -
      //Math.floor((this.props.trainingsize / 100) * this.props.events.length)
      this.props.events.length -
      Math.floor((this.props.trainingsize / 100) * this.props.events.length)
    );
  }
  hastaEntrenamiento() {
    //return this.props.events.length - this.props.const_window_size;
    return (
      this.props.events.length -
      this.props.const_window_size -
      this.props.const_future_steps
    );
  }
  desdeValidacion() {
    return 0;
  }
  hastaValidacion() {
    return (
      this.props.events.length -
      Math.floor((this.props.trainingsize / 100) * this.props.events.length)
    );
    //return this.props.events.length - this.props.const_window_size;
  }
  onClickValidate() {
    let sma_vec = this.props.vectorSMA;
    let inputs = sma_vec.map(function(inp_f) {
      return inp_f["set"].map(function(val) {
        return parseFloat(val["y"]);
      });
    });
    let trainingsize = this.props.trainingsize;
    let window_size = this.props.const_window_size;
    let data_raw = this.props.events;
    // validate on training

    //  inputs.length - Math.floor((trainingsize / 100) * inputs.length);

    let val_train_x = inputs.slice(
      this.desdeEntrenamiento(),
      this.hastaEntrenamiento()
    );
    //console.log(this.desdeEntrenamiento() + "-" + this.hastaEntrenamiento());
    //let val_train_x = inputs;

    //this.setState({ val_train_x: val_train_x });
    //console.log(val_train_x[0]);
    //console.log("saco desde " + desde + " hasta " + hasta);
    let val_train_y = this.makePredictions(
      val_train_x,
      this.props.model["model"]
    );
    this.setState({ val_train_y: val_train_y });
    //  console.log("val_train_y", val_train_y);
    // validate on unseen
    let val_unseen_x = inputs.slice(
      this.desdeValidacion(),
      this.hastaValidacion()
    );

    let val_unseen_y = this.makePredictions(
      val_unseen_x,
      this.props.model["model"]
    );
    this.setState({ val_unseen_y: val_unseen_y });
    //  console.log("val_unseen_x", val_unseen_x);
    let timestamps_a = data_raw.map(function(val) {
      return val["timestamp"];
    });
    let timestamps_b = data_raw
      .map(function(val) {
        return val["timestamp"];
      })
      .splice(
        window_size,
        data_raw.length -
          Math.floor(((100 - trainingsize) / 100) * data_raw.length)
      ); //.splice(window_size, data_raw.length);
    let timestamps_c = data_raw
      .map(function(val) {
        return val["timestamp"];
      })
      .splice(
        window_size + Math.floor((trainingsize / 100) * inputs.length),
        inputs.length
      );

    let sma = sma_vec.map(function(val) {
      return val["avg"];
    });
    let prices = data_raw.map(function(val) {
      return parseFloat(val["y"]);
    });
    sma = sma.slice(0, Math.floor((trainingsize / 100) * sma.length));
  }

  makePredictions(X, model) {
    const predictedResults = model
      .predict(tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10)))
      .mul(10);
    return Array.from(predictedResults.dataSync());
  }

  render() {
    return (
      <Segment.Group raised>
        <Segment raised>
          <Header as="h4" dividing>
            <Icon name="bullseye" />
            <Header.Content>
              Validación
              <Header.Subheader />
            </Header.Content>
          </Header>
          <center>{this.renderPlot()}</center>
        </Segment>

        <Segment textAlign="center">
          <Button.Group labeled icon color="violet" inverted>
            <Button
              icon="play"
              content="VALIDAR MODELO"
              //onClick={e => this.clickGenerar(e)}
              onClick={this.onClickValidate.bind(this)}
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
    eventos,
    tag,
    limite,
    const_window_size,
    model,
    vectorSMA,
    trainingsize,
    const_future_steps
  }) => {
    //console.log(vectorSMA);
    return {
      events: eventos,
      const_window_size: const_window_size,
      model: model,
      const_future_steps: const_future_steps,
      trainingsize: trainingsize,
      vectorSMA: vectorSMA
      //    isLoading: isLoading
    };
  }
)(Validacion);
