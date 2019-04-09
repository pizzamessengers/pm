import React, { Component } from "react";
import { Route } from "react-router-dom";
import ModulesList from "./../ModulesList";
import ProfileModuleSettings from "./ProfileModuleSettings";

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
        <Route
          path={"/app/settings/profile/:module(user||payment)"}
          render={() => (
            <ProfileModuleSettings refresh={() => this.forceUpdate()} />
          )}
        />
      </div>
    );
  }
}
