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

    this.menuItems = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef()
    ];
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
            ref={this.menuItems[i]}
            key={i}
            drop={menuItem.drop}
            item={menuItem.item}
          />
        ))}
      </Fragment>
    );
  }
}
