import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes from "prop-types"; // ES6
import { withTracker } from "meteor/react-meteor-data";
import LoaderExampleText from "./LoaderExampleText.js";
import Sensors from "/imports/api/sensors.js";
import ReactDOM from "react-dom";
import Telemetria from "./Telemetria.jsx";
import TelemetriaTensor from "./TelemetriaTensor.jsx";
import { useHistory } from "react-router-dom";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import {
  Icon,
  Label,
  Statistic,
  Menu,
  Table,
  Segment,
  List,
  Button,
  Divider,
  Form,
  Grid,
  Dropdown,
  Modal,
  Header
} from "semantic-ui-react";

//const App = () => (

class Sensores extends Component {
  state = {
    sensorId: "",
    sensorCodigo: "",
    modalOpen: false
  };

  renderFila() {
    return this.props.sensores.map(sensor => (
      <Table.Row key={sensor._id}>
        <Table.Cell collapsing>{sensor.codigo}</Table.Cell>
        <Table.Cell collapsing>{sensor.descripcion}</Table.Cell>
        <Table.Cell textAlign="right">
          <Button
            as={Link}
            to={`/sensorhome/${sensor._id}`}
            basic
            color="violet"
            content=<center>
              <Icon name="angle right" />
            </center>
            size="mini"
          />
        </Table.Cell>
      </Table.Row>
    ));
  }

  renderTable() {
    return (
      <Table singleLine selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <h4>CODIGO</h4>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <h4>DESCRIPCION</h4>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <h4 />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{this.renderFila()}</Table.Body>
      </Table>
    );
  }

  renderModal() {
    return (
      <TelemetriaTensor
        tagId={this.props.tagId}
        tag={this.props.tag}
        sensorId={this.state.sensorId}
        sensorCodigo={this.state.sensorCodigo}
        modalOpen={this.state.modalOpen}
        handleClose={() => {
          this.setState({ modalOpen: false });
        }}
      />
    );
  }

  render() {
    if (this.props.isLoading) {
      return <LoaderExampleText />;
    }
    return (
      <div>
        {this.renderTable()}
        {this.renderModal()}
      </div>
    );
  }
}

export default withTracker(({ tagId, tag }) => {
  const handles = [Meteor.subscribe("sensorsOne", tagId)];

  const loading = handles.some(handle => !handle.ready());

  return {
    isLoading: loading,
    sensores: Sensors.find({ activo: true }).fetch()
  };
})(Sensores);
