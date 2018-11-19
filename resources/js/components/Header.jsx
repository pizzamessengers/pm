import { Link } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";
import Auth from "./../contexts/Auth";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: null
    };
  }

  componentWillMount() {
    this.setState({ auth: this.context });
  }

  render() {
    console.log(this.state.auth);
    let menu = this.state.auth ? (
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    ) : (
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Regiser</Link>
        </li>
      </ul>
    );

    return (
      <header>
        <nav>{menu}</nav>
      </header>
    );
  }
}

Header.contextType = Auth;
