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

export class LineaBase extends Component {
  getSerie() {
    return this.props.events.map(event => ({
      x: event.createdAt,
      y: event.message
    }));
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

  ComputeSMA(data, window_size) {
    let r_avgs = [],
      avg_prev = 0;
    for (let i = 0; i <= data.length - window_size; i++) {
      let curr_avg = 0.0,
        t = i + window_size;
      for (let k = i; k < t && k <= data.length; k++) {
        curr_avg += data[k]["y"] / window_size;
      }
      r_avgs.push({ set: data.slice(i, i + window_size), avg: curr_avg });
      avg_prev = curr_avg;
    }
    //  console.log(r_avgs);
    /////////////////////////////////////////
    let vector = [];
    let objetoOld, objetoNew;
    for (let k = 0; k <= data.length - window_size; k++) {
      //console.log(k);
      objetoOld = data[k];
      objetoNew = { x: objetoOld.x, y: String(r_avgs[k].avg) };
      vector[k] = objetoNew;
    }
    return vector;
  }

  render() {
    //console.log(this.props.const_window_size);
    if (this.props.isLoading) {
      return <LoaderExampleText />;
    }
    //console.log(this.getSerie());
    let array = this.ComputeSMA(this.getSerie(), this.props.const_window_size);
    //console.log(this.getSerie());
    //console.log(this.ComputeSMA(this.getSerie(), this.props.const_window_size));
    return <Line data={this.getDataConfig()} options={this.getDataOptions()} />;
  }
}

export default withTracker(
  ({ sensorCodigo, tag, limite, const_window_size }) => {
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
          sort: { createdAt: -1 },
          limit: limite
        }
      ).fetch(),
      const_window_size: const_window_size,
      isLoading: isLoading
    };
  }
)(LineaBase);
