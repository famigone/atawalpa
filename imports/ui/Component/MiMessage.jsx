import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";

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

//const App = () => (

export default class MiMessage extends Component {
  render() {
    if (this.props.visible) {
      return (
        <Message color={this.props.color} visible>
          {this.props.message}
        </Message>
      );
    } else {
      return <Message color={this.props.color} hidden />;
    }
  }
}
