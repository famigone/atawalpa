import React, { Component } from "react";
import { Icon, Input, Menu, Container, Image } from "semantic-ui-react";
import { Session } from "meteor/session";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export default class BarraEstado extends Component {
  state = { activeItem: "home" };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  handleItemAsset = (e, { name }) => {
    this.setState({ activeItem: name });
  };
  handleDl = (e, { dl_id }) => {
    this.setState({ dl_id: dl_id });
  };
  handleItemLogout = (e, { name }) => {
    this.setState({ activeItem: name });
    Meteor.logout();
  };
  handleItemUsuarios = (e, { name }) => {
    this.setState({ activeItem: name });
  };
  render() {
    const { activeItem } = this.state;

    return (
      <Menu inverted color="teal">
        <Menu.Item>
          {/*<Image centered size="tiny" src="/img/ripioh_white.png" />*/}
          <b>ATAWALPA</b>
        </Menu.Item>
        <Menu.Item as={Link} to="/tags" onClick={this.handleItemClick}>
          <Icon name="tags" />
        </Menu.Item>
        <Menu.Item as={Link} to="/za" onClick={this.handleItemClick}>
          <Icon name="sitemap" />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            name="consultasadmin"
            as={Link}
            to="/analisis"
            onClick={this.handleItemClick}
            active={activeItem === "consultasadmin"}
          >
            <Icon name="pie chart" />
          </Menu.Item>

          <Menu.Item
            active={activeItem === "Logout"}
            as={Link}
            to="#"
            onClick={this.handleItemLogout}
          >
            Salir
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
