import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubMenu from "./SubMenu";

export default class MenuItem extends Component {
  constructor() {
    super();
    this.state = {
      opened: null
    };

    this.icons = {
      messengers: ["fas", "comments"],
      settings: ["fas", "cog"],
      logout: ["fas", "power-off"],
      messages: ["fas", "envelope"]
    };

    this.menuItem = React.createRef();
  }

  handleClick = () => {
    switch (this.props.item) {
      case "messengers":
      case "settings":
        this.toggleMenu();
        break;
      case "messages":
        this.toggleMessages();
        break;
      case "logout":
        this.logout();
        break;
    }
  };

  toggleMenu = () => {
    this.props.closeAll();
    this.setState({ opened: !this.state.opened });
  };

  toggleMessages = () => {
    $(".wrapper").toggleClass("showMessagesWindow");
  };

  close = () => {
    this.setState({ opened: false });
  };

  logout = () => {
    axios.post("logout").then(() => {
      window.location = window.location.origin;
    });
  };

  render() {
    let { drop, item } = this.props;
    let { opened } = this.state;
    return (
      <div className="menu-item-wrap">
        <div
          className={opened ? "menu-item active" : "menu-item"}
          onClick={this.handleClick}
          ref={this.menuItem}
        >
          <FontAwesomeIcon className="icon" icon={this.icons[item]} />
        </div>
        {drop ? <SubMenu opened={opened} item={item} /> : null}
      </div>
    );
  }
}
