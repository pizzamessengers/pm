import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import CrmContext from "./../../contexts/CrmContext";
import Socials from "./socials/Socials";
import Settings from "./settings/Settings";

export default class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crm: crm
    };
  }

  componentDidMount() {
    Echo.private(`${apiToken}.crm`).listen(".crm.connection", e => {
      this.setState({ crm: e.crm });
    });
  }

  render() {
    return (
      <div className="content">
        <CrmContext.Provider value={this.state.crm}>
          <Switch>
            <Route path="/app/socials" component={Socials} />
            <Route path="/app/settings" component={Settings} />
          </Switch>
        </CrmContext.Provider>
      </div>
    );
  }
}
