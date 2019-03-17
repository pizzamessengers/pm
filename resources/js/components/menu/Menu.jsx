import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuItems from "./MenuItems";
import CloseMenu from "./../../contexts/CloseMenu";

export default class Menu extends Component {
  constructor() {
    super();
    this.state = {
      opened: false
    };

    this.menuItems = React.createRef();
  }

  toggleMenu = () => {
    this.state.opened ? this.closeMenu() : this.openMenu();
  };

  openMenu = () => {
    this.setState({ opened: true });
    $(".wobble").addClass("ripple");
    setTimeout(function() {
      $(".wobble").removeClass("ripple");
    }, 1000);
  };

  closeMenu = () => {
    this.menuItems.current.closeAll();

    setTimeout(() => {
      this.setState({ opened: false });
      $(".wobble").addClass("ripple");
      setTimeout(function() {
        $(".wobble").removeClass("ripple");
      }, 1000);
    }, 300);
  };

  render() {
    return (
      <div className="menu">
        <div className="blob-nav">
          <div className="wobble" />
          <div className="wobble" />
          <div className="toggle" onClick={this.toggleMenu}>
            <FontAwesomeIcon className="icon" icon="pizza-slice" />
          </div>
          <nav
            className={
              !this.state.opened ? "menu-item-wrap" : "menu-item-wrap slide-out"
            }
          >
            <CloseMenu.Provider value={this.closeMenu}>
              <MenuItems history={this.props.history} ref={this.menuItems} />
            </CloseMenu.Provider>
          </nav>
        </div>
      </div>
    );
  }
}
