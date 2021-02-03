import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { updateLocacion } from "/api/methods.js";
import { insertSensor } from "/api/methods.js";
import Sensors from "/imports/api/sensors.js";
import Events from "/imports/api/events.js";
import Telemetria from "./Telemetria.jsx";
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

export class TelemetriaTensor extends Component {
  render() {
    if (this.props.isLoading) {
      return <LoaderExampleText />;
    }
    console.log(this.props.events.length);
    return (
      <div>
        <div className="plot" id="plot1" />
        <Modal
          centered={true}
          open={this.props.modalOpen}
          onClose={this.props.handleClose}
          closeOnEscape={true}
          size={"fullscreen"}
        >
          <Modal.Header>
            {this.props.tag} - {this.props.sensor.codigo}
          </Modal.Header>
          <Modal.Content>
            <Telemetria
              eventos={this.props.events}
              sensorCodigo={this.props.sensor.codigo}
              tag="asdf"
              limite={const_limit_telemetria}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color="violet" onClick={() => this.props.handleClose()}>
              Salir
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default withTracker(({ tag, sensor }) => {
  //const handles = [Meteor.subscribe("eventsOne", sensorCodigo)];
  //  console.log("sensor " + sensor.codigo + " tag " + tag);
  filtro = tag + "/" + sensor.codigo;
  //const handles = [Meteor.subscribe("eventsOne", filtro)];
  const handles = [Meteor.subscribe("eventsOneLimit", filtro)];
  var isLoading = handles.some(handle => !handle.ready());
  //const elSensor = Sensors.findOne(sensorid);

  return {
    events: Events.find(
      { topic: filtro },
      {
        sort: { createdAt: -1 },
        limit: const_limit_telemetria
      }
    ).fetch(),
    isLoading: isLoading
  };
})(TelemetriaTensor);
