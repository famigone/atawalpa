import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { updateLocacion } from "/api/methods.js";
import { insertSensor } from "/api/methods.js";
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

export default class ModalSensor extends Component {
  renderFormSensor() {
    return (
      <Form onSubmit={this.handleSubmitSensor.bind(this)}>
        <Form.Group widths="equal">
          <Form.Field>
            <input ref="textInputCodigo" placeholder="código del sensor" />
          </Form.Field>
          <Form.Field>
            <input ref="textInputDescripcion" placeholder="descripción" />
          </Form.Field>
        </Form.Group>
        <Button color="violet" type="submit" size="mini">
          Guardar
        </Button>
        <Button
          color="violet"
          type="submit"
          size="mini"
          onClick={this.props.handleClose}
        >
          Cancelar
        </Button>
      </Form>
    );
  }

  handleSubmitSensor(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const textCodigo = ReactDOM.findDOMNode(
      this.refs.textInputCodigo
    ).value.trim();
    const textDescripcion = ReactDOM.findDOMNode(
      this.refs.textInputDescripcion
    ).value.trim();
    const one = {
      codigo: textCodigo,
      descripcion: textDescripcion,
      tagId: this.props.tagId
    };
    // Call the Method
    //insertLocacion.validate(one);
    insertSensor.call(one, (err, res) => {
      if (err) {
        console.log(err);
      }
    });

    ReactDOM.findDOMNode(this.refs.textInputCodigo).value = "";
    ReactDOM.findDOMNode(this.refs.textInputDescripcion).value = "";
  }

  render() {
    return (
      <div>
        <Modal
          centered={true}
          open={this.props.modalOpen}
          onClose={this.props.handleClose}
          closeOnEscape={true}
          //size={"fullscreen"}
        >
          <Modal.Header>Nuevo sensor para {this.props.tag}</Modal.Header>
          <Modal.Content>{this.renderFormSensor()}</Modal.Content>
        </Modal>
      </div>
    );
  }
}
