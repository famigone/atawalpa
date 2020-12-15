import React, { Component } from "react";
import { Icon, Label, Menu, Table } from "semantic-ui-react";

// Task component - represents a single todo item
export default class Event extends Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.event.topic}</Table.Cell>
        <Table.Cell>{this.props.event.message}</Table.Cell>
        <Table.Cell>{Date(this.props.event.createdAt).toString()}</Table.Cell>
      </Table.Row>
    );
  }
}
