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
import Modelo from "./Modelo.jsx";

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
  getSerie() {
    return this.props.events.map(event => ({
      x: event.createdAt,
      y: event.message
    }));
  }
  renderHeader() {
    return (
      <Segment raised>
        <Header as="h2">
          <Icon name="podcast" />
          <Header.Content>
            {this.props.elSensor.tag() + " - " + this.props.elSensor.codigo}
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
            sensorCodigo={this.props.elSensor.codigo}
            tag={this.props.elSensor.tag()}
            limite={const_limit_mms}
            const_window_size={const_window_size}
          />
        </Segment>
        <Segment>
          {const_limit_mms} puntos de datos - {const_window_size} de ventana
          móvil
        </Segment>
      </Segment.Group>
    );
  }
  renderModel() {
    return (
      <Segment.Group raised>
        <Segment raised>
          <Header as="h4" dividing>
            <Icon name="chart area" />
            <Header.Content>
              Modelo Predictivo
              <Header.Subheader />
            </Header.Content>
          </Header>
          <Modelo
            sensorCodigo={this.props.elSensor.codigo}
            tag={this.props.elSensor.tag()}
            limite={const_limit_mms}
            const_window_size={const_window_size}
          />
        </Segment>
        <Segment textAlign="center">
          <Button.Group labeled icon color="violet" inverted>
            <Button icon="play" content="GENERAR DATASET" />
            <Button icon="play" content="ENTRENAR MODELO" />
            <Button icon="play" content="HACER PREDICCIÓN" />
          </Button.Group>
        </Segment>
      </Segment.Group>
    );
  }
  renderEntranamiento() {
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
        </Segment>
        <Segment textAlign="center">
          <Button.Group labeled icon color="violet" inverted>
            <Button icon="play" content="GENERAR DATASET" />
            <Button icon="play" content="ENTRENAR MODELO" />
            <Button icon="play" content="HACER PREDICCIÓN" />
          </Button.Group>
        </Segment>
      </Segment.Group>
    );
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
        <Grid.Row>
          <Grid.Column width={16}>{this.renderEntranamiento()}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {this.renderModel()} <Segment />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withTracker(({ id }) => {
  const handles = [
    Meteor.subscribe("sensorsOneSensor", id),
    Meteor.subscribe("tags")
  ];
  var isLoading = handles.some(handle => !handle.ready());
  return {
    elSensor: Sensors.findOne(id),
    isLoading: isLoading
  };
})(SensorHome);
