import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import PropTypes from "prop-types"; // ES6
import { insertTag } from "/api/methods.js";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import ModalSensor from "./modalSensor.jsx";
import Sensores from "./Sensores.jsx";
import LoaderExampleText from "./LoaderExampleText.js";
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
  Modal,
  Header
} from "semantic-ui-react";

//const App = () => (

export class TagHome extends Component {
  state = {
    tag: "",
    tagId: "",
    habilitarBoton: false,
    modalOpen: false
  };

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
      }
    });

    ReactDOM.findDOMNode(this.refs.textInputCodigo).value = "";
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Form.Group widths="equal">
          <Form.Field>
            <input ref="textInputCodigo" placeholder="tag" />
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
      <Table singleLine selectable>
        <Table.Header>
          <Table.Row />
        </Table.Header>

        <Table.Body>{this.renderFila()}</Table.Body>
      </Table>
    );
  }
  clickFila(id, tag) {
    this.setState({ tag: tag, tagId: id, habilitarBoton: true });
  }

  renderFila() {
    return this.props.tags.map(tag => (
      <Table.Row key={tag._id} onClick={() => this.clickFila(tag._id, tag.tag)}>
        <Table.Cell collapsing>{tag.tag}</Table.Cell>
      </Table.Row>
    ));
  }

  renderModal() {
    return (
      <ModalSensor
        tagId={this.state.tagId}
        tag={this.state.tag}
        modalOpen={this.state.modalOpen}
        handleClose={() => {
          this.setState({ modalOpen: false });
        }}
      />
    );
  }
  render() {
    if (this.props.isLoading) {
      return <LoaderExampleText />;
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <Segment raised>
              <Header dividing>Nuevo Tag</Header>
              {this.renderForm()}
            </Segment>
            <Segment raised>
              <Header dividing>Tags Activos</Header>
              {this.renderTags()}
            </Segment>
          </Grid.Column>
          <Grid.Column width={11}>
            <Segment raised>
              <Header as="h2" floated="right">
                <Button
                  size="mini"
                  color="violet"
                  active={this.state.habilitarBoton}
                  onClick={() => {
                    this.setState({ modalOpen: true });
                  }}
                >
                  NUEVO
                </Button>
              </Header>
              <Header as="h2" dividing>
                <Icon name="podcast" />
                <Header.Content>
                  {this.state.tag}
                  <Header.Subheader>Sensores asociados al tag</Header.Subheader>
                </Header.Content>
              </Header>
            </Segment>
            <Segment raised>
              <Sensores tagId={this.state.tagId} tag={this.state.tag} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
        {this.renderModal()}
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
