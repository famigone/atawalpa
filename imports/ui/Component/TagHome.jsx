import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes from "prop-types"; // ES6
import { insertTag } from "/api/methods.js";
import ReactDOM from "react-dom";

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

export default class TagHome extends Component {
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const textCodigo = ReactDOM.findDOMNode(
      this.refs.textInputCodigo
    ).value.trim();

    const one = {
      codigo: textCodigo
    };
    // Call the Method
    //insertLocacion.validate(one);
    insertTag.call(one, (err, res) => {
      if (err) {
        console.log(err);
      } else {
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
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Segment>
              <Header dividing>Nuevo Tag</Header>
              {this.renderForm()}
            </Segment>
          </Grid.Column>
          <Grid.Column width={13}>
            <Segment />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
