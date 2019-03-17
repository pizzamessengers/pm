import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import CloseMenu from "./../../contexts/CloseMenu";

export default class MenuLink extends Component {
  constructor() {
    super();
  }

  handleClick = () => {
    this.context();
    if (window.innerWidth < 992 && $(".wrapper").hasClass("showMessagesWindow"))
      $(".wrapper").removeClass("showMessagesWindow");
  };

  render() {
    let { icon, link } = this.props;

    return (
      <Link
        className="menu-item"
        to={"/app/" + link}
        onClick={this.handleClick}
      >
        <FontAwesomeIcon className="icon" icon={icon} />
      </Link>
    );
  }
}

MenuLink.contextType = CloseMenu;
