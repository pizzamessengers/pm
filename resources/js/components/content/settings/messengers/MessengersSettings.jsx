import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import ModulesList from "./../ModulesList";
import MessengerSettings from "./MessengerSettings";

export default class MessengersSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedMessengers: null,
      currentMess: null
    };
  }

  componentWillMount() {
    let connectedMessengers = [];
    let currentMess = this.props.location.pathname.substr(24);

    for (let mess in socials) {
      if (socials[mess])
        connectedMessengers.push(mess);
    }

    if (currentMess === '') {
      currentMess = connectedMessengers[0];
    }

    this.setState({ connectedMessengers, currentMess });
  }

  rightRoutes = (routes = "") => {
    return this.state.connectedMessengers.join("||");
  };

  remove = mess => {
    let { connectedMessengers } = this.state,
        currentMess;
    connectedMessengers.splice(connectedMessengers.indexOf(mess), 1);

    if (connectedMessengers.length > 0) {
      currentMess = connectedMessengers[0];
      this.props.history.push("/app/settings/messenger/"+currentMess);
    }

    this.setState({ connectedMessengers, currentMess });
  };

  changeCurrentMess = currentMess => {
    this.setState({ currentMess });
  }

  render() {
    let { connectedMessengers, currentMess } = this.state;
    if (this.props.location.pathname.substr(24) === '') this.props.history.push(this.props.location.pathname + '/' + currentMess);

    return (
      <div className="container modules-settings">
        <ModulesList modules={connectedMessengers} setting={'messenger'} currentModule={currentMess} changeCurrentModule={this.changeCurrentMess} />
        <Route
          path={"/app/settings/messenger/:mess(" + this.rightRoutes() + ")"}
          render={browser => (
            <MessengerSettings currentMess={currentMess} match={browser.match} remove={this.remove} />
          )}
        />
      </div>
    );
  }
}
