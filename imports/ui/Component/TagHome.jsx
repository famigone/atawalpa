import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes from "prop-types"; // ES6
import { insertTag } from "/api/methods.js";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  List,
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
  Message,
  Container,
  Divider,
  Segment,
  Form,
  Header
} from "semantic-ui-react";

//const App = () => (

export class TagHome extends Component {
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const textCodigo = ReactDOM.findDOMNode(
      this.refs.textInputCodigo
    ).value.trim();

    const one = {
      tag: textCodigo
    };
    // Call the Method
    //insertLocacion.validate(one);
    insertTag.call(one, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("ok");
        // seteamos el nuevo Código
      }
    });

    ReactDOM.findDOMNode(this.refs.textInputCodigo).value = "";
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Form.Group widths="equal">
          <Form.Field>
            <input ref="textInputCodigo" placeholder="sensor/codigo" />
          </Form.Field>
        </Form.Group>
        <Button color="violet" type="submit" size="mini">
          Guardar
        </Button>
      </Form>
    );
  }

  renderTags() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <h4>TAG</h4>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{this.renderFila()}</Table.Body>
      </Table>
    );
  }
  clickFila(tagid) {
    console.log(tagid);
  }
  renderFila() {
    return this.props.tags.map(tag => (
      <Table.Row key={tag._id} onClick={() => this.clickFila(tag._id)}>
        <Table.Cell collapsing>{tag.tag}</Table.Cell>
      </Table.Row>
    ));
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <Segment>
              <Header dividing>Nuevo Tag</Header>
              {this.renderForm()}
            </Segment>
            <Segment>
              <Header dividing>Tags Activos</Header>
              {this.renderTags()}
            </Segment>
          </Grid.Column>
          <Grid.Column width={11}>
            <Segment />
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default withTracker(({}) => {
  const handles = [Meteor.subscribe("tags")];
  const loading = handles.some(handle => !handle.ready());
  return {
    tags: Tags.find({}).fetch(),
    isLoading: loading
  };
})(TagHome);
