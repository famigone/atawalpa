import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import MiMessage from "/imports/ui/Component/MiMessage.jsx";

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

export default class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      visible: false
    };
  }
  handleClose = () => this.setState({ modalOpen: false, visible: false });
  handleOpen = () => this.setState({ modalOpen: true });

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Código</label>
            <input
              ref="textInputCodigo"
              placeholder="Código"
              //defaultValue={this.props.dl.codigo}
            />
          </Form.Field>
          <Form.Field>
            <label>Latitud</label>
            <input
              ref="textInputX"
              placeholder="-37.707615"
              //defaultValue={this.props.dl.latitud}
            />
          </Form.Field>
          <Form.Field>
            <label>Longitud</label>
            <input
              ref="textInputY"
              placeholder="-68.902159"
              //defaultValue={this.props.dl.longitud}
            />
          </Form.Field>
          <Form.Field>
            <label>Cantidad de Camiones</label>
            <input
              ref="textCamiones"
              placeholder="00"
              //defaultValue={this.props.dl.camiones}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>Cantidad de Bateas</label>
            <input
              ref="textBateas"
              placeholder="00"
              //defaultValue={this.props.dl.bateas}
            />
          </Form.Field>
          <Form.Field>
            <label>Velocidad promedio</label>
            <input
              ref="textVelocidad"
              placeholder="km"
              //defaultValue={this.props.dl.velocidad}
            />
          </Form.Field>
          <Form.Field>
            <label>Estimado de producción por metro</label>
            <input
              ref="textEstimado"
              placeholder="m3"
              //defaultValue={this.props.dl.estimado}
            />
          </Form.Field>
        </Form.Group>
        <Button color="teal" type="submit">
          Aplicar
        </Button>
        <Button color="teal" onClick={this.handleClose}>
          <Icon name="checkmark" /> Cerrar
        </Button>

        <MiMessage
          color="teal"
          visible={this.state.visible}
          message="Modificación realizada"
        />
      </Form>
    );
  }
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const textCamiones = Number(
      ReactDOM.findDOMNode(this.refs.textCamiones).value
    );
    const textVelocidad = Number(
      ReactDOM.findDOMNode(this.refs.textVelocidad).value
    );
    const textBateas = Number(ReactDOM.findDOMNode(this.refs.textBateas).value);
    const textX = ReactDOM.findDOMNode(this.refs.textInputX).value.trim();
    const textY = ReactDOM.findDOMNode(this.refs.textInputY).value.trim();
    const textEstimado = Number(
      ReactDOM.findDOMNode(this.refs.textEstimado).value
    );
    const textCodigo = ReactDOM.findDOMNode(
      this.refs.textInputCodigo
    ).value.trim();
    const one = {
      codigo: textCodigo,
      latitud: textX,
      longitud: textY,
      camiones: textCamiones,
      velocidad: textVelocidad,
      bateas: textBateas,
      estimado: textEstimado
      //  activo: true
    };
    // Call the Method
    //insertLocacion.validate(one);

    // Clear form
  }
  render() {
    return (
      <Modal
        centered={false}
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Modal.Header>asdasdf</Modal.Header>
        <Modal.Content image>
          <Modal.Description>{this.renderForm()}</Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
