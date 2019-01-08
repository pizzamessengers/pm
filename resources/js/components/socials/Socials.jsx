import React, { Component, Fragment } from "react";
import { Link, Switch, Route } from "react-router-dom";

import Vk from "./Vk";
import Inst from "./Inst";
import Wapp from "./Wapp";
import Dialog from "./Dialog";

export default class Socials extends Component {
  constructor(props) {
    super(props);
  }

  connect = (mess, token, watching, e) => {
    e.preventDefault();
    let data = {
      name: mess,
      token: token,
      watching: watching
    };
    axios
      .post("api/v1/messengers?api_token=" + apiToken, data)
      .then(response => {
        if (response.data.success) {
          socials[mess] = [];
          socials[mess].id = response.data.messenger.id;
          socials[mess].watching = response.data.messenger.watching;
          socials[mess].dialogList = [];
          this.forceUpdate();
        }
      });
  };

  remove = (mess, e) => {
    e.preventDefault();
    socials[mess] = null;
    this.forceUpdate();
    let data = {
      name: mess
    };
    axios.delete("api/v1/messengers?api_token=" + apiToken, { data });
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
            render={() => <Vk connect={this.connect} remove={this.remove} />}
          />
          <Route
            exact
            path="/socials/inst"
            render={() => <Inst connect={this.connect} remove={this.remove} />}
          />
          <Route
            exact
            path="/socials/wapp"
            render={() => <Wapp connect={this.connect} remove={this.remove} />}
          />
          <Route path="/socials/:mess/:dialog/" component={Dialog} />
        </Switch>
      </Fragment>
    );
  }
}
