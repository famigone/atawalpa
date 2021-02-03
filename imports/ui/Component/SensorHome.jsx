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

export class SensorHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: [],
      sma_vec: [],
      tensor: []
    };
    this.setModel = this.setModel.bind(this);
    //this.setSMA = this.setSMA.bind(this);
    this.setTensor = this.setTensor.bind(this);
  }

  setModel(theModel) {
    //console.log(theModel);
    this.setState({ model: theModel });
  }
  setTensor(tensor) {
    //console.log(theModel);
    this.setState({ tensor: tensor });
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

  renderEntrenamiento() {
    return (
      <Entrenamiento
        sensorCodigo={this.props.elSensor.codigo}
        tag={this.props.elSensor.tag()}
        limite={this.props.config.const_limit_mms}
        const_window_size={this.props.config.const_window_size}
        setModel={this.setModel}
        eventos={this.props.eventsMMS}
        setSMA={this.setSMA}
        trainingsize={this.props.config.trainingsize}
        n_epochs={this.props.config.n_epochs}
        learningrate={this.props.config.learningrate}
        n_hiddenlayers={this.props.config.n_hiddenlayers}
        eventsMMS={this.props.eventsMMS}
        setTensor={this.setTensor}
      />
    );
  }

  renderPrediccion() {
    return (
      <Prediccion
        sensorCodigo={this.props.elSensor.codigo}
        tag={this.props.elSensor.tag()}
        limite={this.props.config.const_limit_mms}
        const_window_size={this.props.config.const_window_size}
        const_future_steps={this.props.config.const_future_steps + 1}
        model={this.state.model}
        eventos={this.props.eventsPrediccion}
        vectorSMA={this.state.tensor}
        trainingsize={this.props.config.trainingsize}
        n_epochs={this.props.config.n_epochs}
        learningrate={this.props.config.learningrate}
        n_hiddenlayers={this.props.config.n_hiddenlayers}
      />
    );
  }
  renderValidacion() {
    return (
      <Validacion
        sensorCodigo={this.props.elSensor.codigo}
        eventos={this.props.eventsMMS}
        tag={this.props.elSensor.tag()}
        limite={this.props.config.const_limit_mms}
        const_window_size={this.props.config.const_window_size}
        model={this.state.model}
        vectorSMA={this.state.tensor.reverse()}
        trainingsize={this.props.config.trainingsize}
        const_future_steps={this.props.config.const_future_steps + 1}
      />
    );
  }
  render() {
    if (this.props.isLoading) {
      return <LoaderExampleText />;
    }

    return (
      <Grid>
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

export default withTracker(({ codigo, tag, config }) => {
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
    config: config,

    eventsMMS: Events.find(
      { topic: filtro },
      {
        sort: { createdAt: -1 },
        limit: config.const_limit_mms
      }
    ).fetch(),
    eventsPrediccion: Events.find(
      { topic: filtro },
      {
        sort: { createdAt: -1 },
        limit: config.const_window_size
      }
    ).fetch(),
    isLoading: isLoading
  };
})(SensorHome);
