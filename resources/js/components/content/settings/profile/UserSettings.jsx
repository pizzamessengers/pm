import React, { Component } from "react";
import translate from "./../../../../functions/translate";
import LangChoosing from "./LangChoosing";

export default class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="settings-wrapper h-100 d-flex flex-column">
        <div className="module-setting">
          <div className="col-7 setting-name">{translate("settings.lang")}</div>
          <div className="d-flex justify-content-center col-5">
            <LangChoosing refresh={this.props.refresh} />
          </div>
        </div>
        <div className="module-setting">
          <div className="col-7 setting-name">{translate("settings.user")}</div>
          <div className="d-flex justify-content-center col-5">{userName}</div>
        </div>
        <div className="module-setting">
          <div className="col-7 setting-name">API Token</div>
          <div className="d-flex justify-content-center col-5">{apiToken}</div>
        </div>
      </div>
    );
  }
}
