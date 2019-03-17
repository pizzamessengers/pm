import React, { Component } from 'react';

export default class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <div className="settings-wrapper h-100 d-flex flex-column">
        <div className="module-setting">
          <div className="col-7 setting-name">Имя пользователя</div>
          <div className="d-flex justify-content-center col-5">
            {userName}
          </div>
        </div>
        <div className="module-setting">
          <div className="col-7 setting-name">API Token</div>
          <div className="d-flex justify-content-center col-5">
            {apiToken}
          </div>
        </div>
      </div>
    )
  }
}
