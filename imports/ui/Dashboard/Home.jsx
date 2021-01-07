import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes from "prop-types"; // ES6

import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  List,
  useRouteMatch
} from "react-router-dom";
import { Image, Container, Divider, Segment, Header } from "semantic-ui-react";

//const App = () => (

export default class Home extends Component {
  render() {
    return (
      <div>
        <Segment
          inverted
          vertical
          color="teal"
          style={{
            position: "fixed",
            width: "100%",
            bottom: "0"
          }}
        >
          <Container textAlign="center">{}</Container>
        </Segment>
        <Segment />
      </div>
    );
  }
}
