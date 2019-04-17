import React, { Component, Fragment } from "react";
import translate from "./../../../../functions/translate";
import CheckBox from "./../../elements/CheckBox";
import DialogsConnection from "./../../socials/dialogs/DialogsConnection";

export default class MessengerSettings extends Component {
  constructor(props) {
    super(props);
    this.mess = socials[this.props.currentMess];
    this.state = {
      updating: this.mess ? this.mess.updating : null,
      watching: this.mess ? this.mess.watching : null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentMess !== prevProps.currentMess) {
      let mess = socials[this.props.currentMess];
      this.mess = mess;
      this.setState({
        updating: mess ? mess.updating : null,
        watching: mess ? mess.watching : null
      });
    }
  }

  toggleUpdating = e => {
    let updating = e.target.checked;
    this.setState({ updating });
    this.mess.updating = updating;
    axios.put(
      "api/v1/messengers/updating/" + this.mess.id + "?api_token=" + apiToken
    );
  };

  toggleWatching = () => {
    let watching;
    if (this.state.watching === "all") {
      watching = "dialogs";
    } else {
      watching = "all";
    }
    this.setState({ watching });
    this.mess.watching = watching;
    axios.put(
      "api/v1/messengers/watching/" + this.mess.id + "?api_token=" + apiToken,
      { watching }
    );
  };

  remove = mess => {
    if (/vk||inst||wapp/.test(mess)) {
      let data = {
        name: mess
      };
      axios
        .delete("api/v1/messengers?api_token=" + apiToken, { data })
        .then(response => {
          if (!response.data.success) alert(translate(response.data.message));
          else {
            socials[mess] = null;
            this.props.remove(mess);
          }
        });
    } else {
      alert(translate("all.error.hack"));
    }
  };

  render() {
    let { updating, watching } = this.state;
    let mess = this.props.currentMess;
    return (
      <div className="module-settings">
        <div className="settings-wrapper">
          <div className="settings d-flex flex-column">
            <div className="module-setting">
              <div className="col-7 setting-name">
                {translate("settings.updating")}
              </div>
              <div className="d-flex justify-content-center col-5">
                <CheckBox
                  checked={updating}
                  handleChange={e => this.toggleUpdating(e)}
                  name="toggleUpdating"
                  withOn
                />
              </div>
            </div>
            <div className="module-setting">
              <div className="col-7 setting-name">
                {translate("settings.mode")}
              </div>
              <div className="d-flex justify-content-center col-5">
                <div className="label">
                  {translate("messenger.watching.all")}
                </div>
                <CheckBox
                  checked={watching === "dialogs"}
                  handleChange={e => this.toggleWatching(e)}
                  name="toggleWatching"
                />
                <div className="label">
                  {translate("messenger.watching.dialogs")}
                </div>
              </div>
            </div>
            {this.state.watching === "dialogs" ? (
              <div className="module-setting">
                <DialogsConnection mess={mess} />
              </div>
            ) : null}
          </div>
        </div>
        <div className="btn-delete-wrapper">
          <button
            className="btn btn-delete mx-auto"
            onClick={() => this.remove(mess)}
            type="submit"
          >
            {translate("all.delete")}
          </button>
        </div>
      </div>
    );
  }
}
