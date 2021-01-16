import ReactDOM from "react-dom";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { updateLocacion } from "/api/methods.js";
import { insertSensor } from "/api/methods.js";
import Sensors from "/imports/api/sensors.js";
import Events from "/imports/api/events.js";
import Tags from "/imports/api/tags.js";
import Telemetria from "./Telemetria.jsx";
import LineaBase from "./LineaBase.jsx";
//import Modelo from "./Modelo.jsx";
import Entrenamiento from "./Entrenamiento.jsx";
import Validacion from "./Validacion.jsx";
import Prediccion from "./Prediccion.jsx";

import LoaderExampleText from "/imports/ui/Component/LoaderExampleText.js";
import { Doughnut, Bar, Line, Scatter } from "react-chartjs-2";
//const tf = require("@tensorflow/tfjs");
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
//require("@tensorflow/tfjs-node");
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

const const_limit_telemetria = 100;
const const_limit_mms = 1000;
const const_window_size = 50;

export class SensorHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: [],
      sma_vec: [],
      trainingsize: 70,
      n_epochs: 5,
      learningrate: 0.01,
      n_hiddenlayers: 1
    };
    this.setModel = this.setModel.bind(this);
    this.setSMA = this.setSMA.bind(this);
    //this.callback = this.callback.bind(this);
  }

  setModel(theModel) {
    //console.log(theModel);
    this.setState({ model: theModel });
  }
  setSMA(SMA) {
    //console.log(theModel);
    this.setState({ setSMA: SMA });
  }

  renderHeader() {
    //console.log(this.props.elSensor);
    return (
      <Segment raised>
        <Header as="h2">
          <Icon name="podcast" />
          <Header.Content>
            {this.props.tag + " - " + this.props.elSensor.codigo}
            <Header.Subheader>Observación y predicción</Header.Subheader>
          </Header.Content>
        </Header>
      </Segment>
    );
  }

  renderTelemetria() {
    return (
      <Segment.Group raised>
        <Segment raised>
          <Header as="h4" dividing>
            <Icon name="chart line" />
            <Header.Content>
              Telemetría
              <Header.Subheader />
            </Header.Content>
          </Header>
          <Telemetria
            eventos={this.props.eventsTelemetria}
            sensorCodigo={this.props.elSensor.codigo}
            tag={this.props.elSensor.tag()}
            limite={const_limit_telemetria}
          />
        </Segment>
        <Segment>{const_limit_telemetria} puntos de datos</Segment>
      </Segment.Group>
    );
  }
  renderMMS() {
    return (
      <Segment.Group raised>
        <Segment raised>
          <Header as="h4" dividing>
            <Icon name="chart area" />
            <Header.Content>
              Media Móvil Simple
              <Header.Subheader />
            </Header.Content>
          </Header>
          <LineaBase
            eventos={this.props.eventsMMS}
            sensorCodigo={this.props.elSensor.codigo}
            tag={this.props.elSensor.tag()}
            limite={const_limit_mms}
            const_window_size={const_window_size}
            setSMA={this.setSMA}
          />
        </Segment>
        <Segment>
          {const_limit_mms} puntos de datos - {const_window_size} de ventana
          móvil
        </Segment>
      </Segment.Group>
    );
  }

  renderEntrenamiento() {
    var vectorSMA = this.ComputeSMA(this.getSerie(), const_window_size);
    //  console.log("this.state.n_hiddenlayers: ", this.state.n_hiddenlayers);
    return (
      <Entrenamiento
        sensorCodigo={this.props.elSensor.codigo}
        tag={this.props.elSensor.tag()}
        limite={const_limit_mms}
        const_window_size={const_window_size}
        setModel={this.setModel}
        eventos={this.props.eventsMMS}
        vectorSMA={vectorSMA}
        trainingsize={this.state.trainingsize}
        n_epochs={this.state.n_epochs}
        learningrate={this.state.learningrate}
        n_hiddenlayers={this.state.n_hiddenlayers}
      />
    );
  }

  renderPrediccion() {
    var vectorSMA = this.ComputeSMA(this.getSerie(), const_window_size);
    //  console.log("this.state.n_hiddenlayers: ", this.state.n_hiddenlayers);
    return (
      <Prediccion
        sensorCodigo={this.props.elSensor.codigo}
        tag={this.props.elSensor.tag()}
        limite={const_limit_mms}
        const_window_size={const_window_size}
        //setModel={this.setModel}
        model={this.state.model}
        eventos={this.props.eventsPrediccion}
        vectorSMA={vectorSMA}
        trainingsize={this.state.trainingsize}
        n_epochs={this.state.n_epochs}
        learningrate={this.state.learningrate}
        n_hiddenlayers={this.state.n_hiddenlayers}
      />
    );
  }
  renderValidacion() {
    var vectorSMA = this.ComputeSMA(this.getSerie(), const_window_size);
    return (
      <Validacion
        sensorCodigo={this.props.elSensor.codigo}
        eventos={this.props.eventsMMS}
        tag={this.props.elSensor.tag()}
        limite={const_limit_mms}
        const_window_size={const_window_size}
        model={this.state.model}
        vectorSMA={vectorSMA}
        trainingsize={this.state.trainingsize}
      />
    );
  }
  getSerie() {
    return this.props.eventsMMS.map(event => ({
      x: event.createdAt,
      y: event.message
    }));
  }
  ComputeSMA(data, window_size) {
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

  render() {
    if (this.props.isLoading) {
      return <LoaderExampleText />;
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>{this.renderHeader()}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>{this.renderTelemetria()}</Grid.Column>
          <Grid.Column width={8}>{this.renderMMS()}</Grid.Column>
        </Grid.Row>
        <Grid.Row />
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>{this.renderEntrenamiento()}</Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>{this.renderValidacion()}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>
            {this.renderPrediccion()} <Segment />
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default withTracker(({ codigo, tag }) => {
  filtro = tag + "/" + codigo;
  //const handles = [Meteor.subscribe("eventsOne", filtro)];

  const handles = [
    Meteor.subscribe("eventsOneLimit", filtro),
    Meteor.subscribe("sensorsOneSensor", codigo)
    //Meteor.subscribe("tags")
  ];
  var isLoading = handles.some(handle => !handle.ready());
  return {
    elSensor: Sensors.findOne({ codigo: codigo }),
    eventsTelemetria: Events.find(
      { topic: filtro },
      {
        sort: { createdAt: -1 },
        limit: const_limit_telemetria
      }
    ).fetch(),
    eventsMMS: Events.find(
      { topic: filtro },
      {
        sort: { createdAt: -1 },
        limit: const_limit_mms
      }
    ).fetch(),
    eventsPrediccion: Events.find(
      { topic: filtro },
      {
        sort: { createdAt: -1 },
        limit: const_window_size
      }
    ).fetch(),
    isLoading: isLoading
  };
})(SensorHome);
