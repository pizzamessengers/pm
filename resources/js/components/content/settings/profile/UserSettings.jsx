import React, { Component } from "react";
import LangChoosing from "./LangChoosing";

export default class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  copyToken = e => {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(e.target).text()).select();
    document.execCommand("copy");
    $temp.remove();
    alert(translate("all.token-copied"));
  };

  render() {
    return (
      <div className="settings-wrapper">
        <div className="settings d-flex flex-column">
          <div className="module-setting">
            <div className="col-7 setting-name">
              {translate("settings.lang")}
            </div>
            <div className="setting-value d-flex justify-content-center col-5">
              <LangChoosing refresh={this.props.refresh} />
            </div>
          </div>
          <div className="module-setting">
            <div className="col-7 setting-name">
              {translate("settings.user")}
            </div>
            <div className="setting-value d-flex justify-content-center col-5">
              {userName}
            </div>
          </div>
          <div className="module-setting flex-column flex-md-row">
            <div className="col-md-7 text-center text-md-left setting-name">
              API Token
            </div>
            <div
              className="setting-value token d-flex justify-content-center col-md-5"
              style={{ cursor: "pointer" }}
              onClick={e => this.copyToken(e)}
            >
              {apiToken}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
