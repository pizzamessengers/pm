import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import ModulesList from "./../ModulesList";
import UserSettings from "./UserSettings";
import Payment from "./Payment";

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
          modules={["user", "payment"]}
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
          </Switch>
        </div>
      </div>
    );
  }
}
