import React, { Component, Fragment } from "react";
import { Link, Switch, Route } from "react-router-dom";

import Vk from "./socials/Vk";
import Inst from "./socials/Inst";
import Wapp from "./socials/Wapp";
import Dialog from "./socials/Dialog";

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
      vk: user.socials.vk.connected,
      inst: user.socials.inst.connected,
      wapp: user.socials.wapp.connected
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
        if (response.data.success) {
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
      <Fragment>
        <div className="d-flex col-12 justify-content-around my-3">
          <Link to="/socials/vk">vk</Link>
          <Link to="/socials/inst">inst</Link>
          <Link to="/socials/wapp">wapp</Link>
        </div>

        <Switch>
          <Route
            exact
            path="/socials/vk"
            render={() => (
              <Vk
                connected={this.state.vk}
                isDialog={false}
                connect={this.connect}
                remove={this.remove}
              />
            )}
          />
          <Route
            exact
            path="/socials/inst"
            render={() => (
              <Inst
                connected={this.state.inst}
                isDialog={false}
                connect={this.connect}
                remove={this.remove}
              />
            )}
          />
          <Route
            exact
            path="/socials/wapp/"
            render={() => (
              <Wapp
                connected={this.state.wapp}
                isDialog={false}
                connect={this.connect}
                remove={this.remove}
              />
            )}
          />
          <Route path="/socials/:mess/:dialog/" component={Dialog} />
        </Switch>
      </Fragment>
    );
  }
}
