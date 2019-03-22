import React, { Component, Fragment } from "react";
import MenuItem from "./MenuItem";

export default class MenuItems extends Component {
  constructor() {
    super();

    this.menuList = [
      {
        drop: true,
        item: "settings"
      },
      {
        drop: false,
        item: "logout"
      },
      {
        drop: true,
        item: "messengers"
      },
      {
        drop: false,
        item: "messages"
      }
    ];

    this.menuItems = [React.createRef(), React.createRef()];
  }

  checkThatOpened = () => {
    for (var i = 0; i < this.menuItems.length; i++) {
      if (this.menuItems[i].current.state.opened) {
        return true;
      }
    }

    return false;
  }

  closeAll = () => {
    for (var i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].current.close();
    }
  };

  render() {
    return (
      <Fragment>
        {this.menuList.map((menuItem, i) => (
          <MenuItem
            closeAll={this.closeAll}
            ref={
              i === 0 ? this.menuItems[0] : i === 2 ? this.menuItems[1] : null
            }
            key={i}
            drop={menuItem.drop}
            item={menuItem.item}
          />
        ))}
      </Fragment>
    );
  }
}
