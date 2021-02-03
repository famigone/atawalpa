import ReactDOM from "react-dom";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import Sensors from "/imports/api/sensors.js";
import Events from "/imports/api/events.js";
import Tags from "/imports/api/tags.js";
import SensorHome from "./SensorHome.jsx";

import LoaderExampleText from "/imports/ui/Component/LoaderExampleText.js";

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
const const_window_size = 5;
const const_future_steps = 10;
export default class SensorParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      visible: false,
      trainingsize: 70,
      n_epochs: 5,
      learningrate: 0.01,
      n_hiddenlayers: 1,
      const_limit_mms: 1000,
      const_window_size: 5,
      const_future_steps: 10
    };
  }
  handleClose = () => this.setState({ modalOpen: false, visible: false });
  handleOpen = () => this.setState({ modalOpen: true, visible: true });

  handleChange = () => {
    const trainingsize = parseFloat(
      ReactDOM.findDOMNode(this.refs.trainingsize).value.trim()
    );
    const n_epochs = parseFloat(
      ReactDOM.findDOMNode(this.refs.n_epochs).value.trim()
    );
    const learningrate = parseFloat(
      ReactDOM.findDOMNode(this.refs.learningrate).value.trim()
    );
    const const_limit_mms = parseFloat(
      ReactDOM.findDOMNode(this.refs.const_limit_mms).value.trim()
    );
    const n_hiddenlayers = parseFloat(
      ReactDOM.findDOMNode(this.refs.n_hiddenlayers).value.trim()
    );
    const const_window_size = parseFloat(
      ReactDOM.findDOMNode(this.refs.const_window_size).value.trim()
    );
    const const_future_steps = parseFloat(
      ReactDOM.findDOMNode(this.refs.const_future_steps).value.trim()
    );

    this.setState({
      trainingsize: trainingsize,
      n_epochs: n_epochs,
      learningrate: learningrate,
      n_hiddenlayers: n_hiddenlayers,
      const_limit_mms: const_limit_mms,
      const_window_size: const_window_size,
      const_future_steps: const_future_steps
    });
    //  console.log(this.state);
  };

  renderForm() {
    return (
      <Form onSubmit={this.handleChange.bind(this)}>
        <Form.Group widths="equal">
          <Form.Field>
            <label>trainingsize</label>
            <input
              ref="trainingsize"
              placeholder="trainingsize"
              value={this.state.trainingsize}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>n_epochs</label>
            <input
              ref="n_epochs"
              placeholder="n_epochs"
              value={this.state.n_epochs}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>learningrate</label>
            <input
              ref="learningrate"
              placeholder="learningrate"
              value={this.state.learningrate}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>n_hiddenlayers</label>
            <input
              ref="n_hiddenlayers"
              placeholder="00"
              value={this.state.n_hiddenlayers}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>const_limit_mms</label>
            <input
              ref="const_limit_mms"
              placeholder="const_limit_mms"
              value={this.state.const_limit_mms}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>const_window_size</label>
            <input
              ref="const_window_size"
              placeholder="const_window_size"
              value={this.state.const_window_size}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>const_future_steps</label>
            <input
              ref="const_future_steps"
              placeholder="const_future_steps"
              value={this.state.const_future_steps}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }

  renderModal() {
    return (
      <Modal
        open={this.state.modalOpen}
        onClose={() => this.handleClose}
        onOpen={() => this.handleOpen}
      >
        <Header icon="cogs" content="Arquitectura de la red neuronal" />
        <Modal.Content>{this.renderForm()}</Modal.Content>
        <Modal.Actions>
          <Button color="teal" onClick={() => this.handleClose()}>
            <Icon name="check" /> OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
  renderHeader() {
    //console.log(this.props.elSensor);
    return (
      <Segment.Group raised>
        <Segment>
          <Header as="h2">
            <Icon name="podcast" />
            <Header.Content>
              {this.props.tag + " - " + this.props.codigo}
              <Header.Subheader>Observación y predicción</Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Segment textAlign="right">
          <Button.Group color="violet">
            <Button
              icon="cogs"
              content="PARAMETRIZAR"
              onClick={this.handleOpen}
            />
          </Button.Group>
        </Segment>
      </Segment.Group>
    );
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>{this.renderHeader()}</Grid.Column>
        </Grid.Row>
        {this.renderModal()}
        <Grid.Row />
        <SensorHome
          codigo={this.props.codigo}
          tag={this.props.tag}
          config={this.state}
        />
      </Grid>
    );
  }
}
