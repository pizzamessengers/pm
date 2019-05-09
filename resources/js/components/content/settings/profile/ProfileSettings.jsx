import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import CrmContext from "./../../../../contexts/CrmContext";
import ModulesList from "./../ModulesList";
import UserSettings from "./UserSettings";
import Payment from "./Payment";
import Crm from "./Crm";

export default class ProfileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentModule: "user"
    };
  }

  changeCurrentModule = currentModule => {
    this.setState({ currentModule });
  };

  render() {
    let { currentModule } = this.state;

    return (
      <div className="container modules-settings">
        <ModulesList
          modules={
            !this.context
              ? ["user", "payment"]
              : ["user", "payment", this.context]
          }
          setting={"profile"}
          currentModule={currentModule}
          changeCurrentModule={this.changeCurrentModule}
        />
        <div className="module-settings">
          <Switch>
            <Route
              path={"/app/settings/profile/user"}
              render={() => <UserSettings refresh={() => this.forceUpdate()} />}
            />
            <Route path={"/app/settings/profile/payment"} component={Payment} />
            <Route
              path={"/app/settings/profile/crm/" + this.context}
              component={Crm}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

ProfileSettings.contextType = CrmContext;
