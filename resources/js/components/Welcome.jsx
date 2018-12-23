import React, { Component } from "react";
import Auth from "./../contexts/Auth";

export default class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1>Hello!</h1>
    );
  }
}
