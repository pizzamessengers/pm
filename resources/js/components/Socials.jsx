import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";

import Vk from "./socials/Vk";
import Inst from "./socials/Inst";
import Wapp from "./socials/Wapp";

export default class Socials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vk: false,
      inst: false,
      wapp: false
    };
  }

  componentWillMount() {
    this.setState({
      vk: user.socials.vk,
      inst: user.socials.inst,
      wapp: user.socials.wapp
    });
  }

  connect = (mess, token, e) => {
    e.preventDefault();
    let data = {
      name: mess,
      token: token
    };
    axios
      .post("./../api/v1/messengers?api_token=" + user.apiToken, data)
      .then(response => {
        if (response.status === 200) {
          this.setState({ [mess]: true });
        }
      });
  };

  remove = (mess, e) => {
    e.preventDefault();
    let data = {
      name: mess
    };
    axios
      .delete("./../api/v1/messengers?api_token=" + user.apiToken, { data })
      .then(response => {
        if (response.status === 200) {
          this.setState({ [mess]: false });
        }
      });
  };

  render() {
    return (
      <div>
        <div className="d-flex col-12 justify-content-around my-3">
          <Link to="/socials/vk">vk</Link>
          <Link to="/socials/inst">inst</Link>
          <Link to="/socials/wapp">wapp</Link>
        </div>

        <div className="social">
          <Switch>
            <Route
              path="/socials/vk"
              render={() => (
                <Vk
                  connected={this.state.vk}
                  connect={this.connect}
                  remove={this.remove}
                />
              )}
            />
            <Route
              path="/socials/inst"
              render={() => (
                <Inst
                  connected={this.state.inst}
                  connect={this.connect}
                  remove={this.remove}
                />
              )}
            />
            <Route
              path="/socials/wapp"
              render={() => (
                <Wapp
                  connected={this.state.wapp}
                  connect={this.connect}
                  remove={this.remove}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
