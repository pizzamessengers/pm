import React, { Component } from "react";

export default class Crm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unparsed: null
    };
    axios.get("api/v1/crm?api_token=" + apiToken).then(response =>
      this.setState({
        unparsed: response.data.unparsed
      })
    );
  }

  toggleUnparsed = () => this.setState({ unparsed: !this.state.unparsed });

  render() {
    let { unparsed } = this.state;

    return (
      <div className="settings-wrapper">
        <div className="settings d-flex flex-column">
          <div className="module-setting">
            <div className="col-7 setting-name">
              {translate("settings.crm.unparsed")}
            </div>
            <div className="setting-value d-flex justify-content-center col-5">
              <CheckBox
                checked={unparsed}
                handleChange={e => this.toggleUnparsed(e)}
                name="toggleUnparsed"
                withOn
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
