import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { updateLocacion } from "/api/methods.js";
import { insertSensor } from "/api/methods.js";
import Sensors from "/imports/api/sensors.js";
import Events from "/imports/api/events.js";
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

export class TelemetriaTensor extends Component {
  getSerie() {
    return this.props.events.map(event => ({
      x: event.createdAt,
      y: event.message
    }));
  }

  tensor() {
    //  const myFirstDataset = tf.data.array(this.props.events);
    //  myFirstDataset.forEachAsync(e => console.log(e.message));

    let values = [
      { x: 1, y: 20 },
      { x: 2, y: 30 },
      { x: 3, y: 5 },
      { x: 4, y: 12 }
    ];
    //let values = this.props.events;
    tfvis.render.linechart(
      document.getElementById("plot1"),
      { values },

      { width: 700 }
    );
  }

  renderLine() {
    //console.log(this.getSerie());
    let data = {
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
        }
      ]

      // These labels appear in the legend and in the tooltips when hovering different arcs
    };
    return (
      <Line
        data={data}
        options={{
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
        }}
      />
    );
  }

  render() {
    //console.log(this.props.events);
    //this.tensor();
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
          <Modal.Header>{this.props.tag}</Modal.Header>
          <Modal.Content>{this.renderLine()}</Modal.Content>
          <Modal.Actions>
            <Button color="violet" onClick={() => dispatch({ type: "close" })}>
              No
            </Button>
            <Button color="violet" onClick={() => dispatch({ type: "close" })}>
              Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default withTracker(({ sensorCodigo, tag }) => {
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
        sort: { createdAt: -1 }
      }
    ).fetch(),
    isLoading: isLoading
  };
})(TelemetriaTensor);
