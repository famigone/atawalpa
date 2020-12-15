import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes from "prop-types"; // ES6
import Events from "/imports/api/events.js";
import Event from "./event.js";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import LoaderExampleText from "/imports/ui/Component/LoaderExampleText.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";
import {
  Grid,
  Input,
  Table,
  Label,
  Menu,
  Card,
  Icon,
  Image,
  Rating,
  Button,
  Progress,
  Container,
  Divider,
  Segment,
  Form,
  Header
} from "semantic-ui-react";

//const App = () => (

class EventHome extends Component {
  getContentView() {
    return this.props.children;
  }

  renderAssets() {
    return this.props.events.map(event => (
      <Event key={event._id} event={event} />
    ));
  }

  renderHeader() {
    return (
      <Header as="h2">
        <Icon name="wifi" />
        <Header.Content>
          Eventos
          <Header.Subheader>Nivel</Header.Subheader>
        </Header.Content>
      </Header>
    );
  }
  renderTable() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Sensor</Table.HeaderCell>
            <Table.HeaderCell>Nivel</Table.HeaderCell>
            <Table.HeaderCell>Timestamp</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderAssets()}</Table.Body>
      </Table>
    );
  }
  render() {
    const { isLoading } = this.props.isLoading;
    if (isLoading) {
      return <LoaderExampleText />;
    }
    return (
      <Grid textAlign="left">
        <Grid.Row>
          <Grid.Column width={16}>
            <div>{this.getContentView()}</div>

            <Segment raised>
              {this.renderHeader()}

              <Divider />

              {this.renderTable()}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
export default withTracker(() => {
  const subEvent = Meteor.subscribe("events");
  let isLoading = !subEvent.ready();
  return {
    events: Events.find({}).fetch(),
    isLoading: isLoading
  };
})(EventHome);
