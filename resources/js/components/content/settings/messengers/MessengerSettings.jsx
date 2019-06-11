import React, { Component, Fragment } from "react";
import Waiting from "./../../elements/Waiting";
import CheckBox from "./../../elements/CheckBox";
import DialogsConnection from "./../../socials/dialogs/DialogsConnection";
import Dialogs from "./../../socials/dialogs/Dialogs";
import VkRefresh from "./VkRefresh";

export default class MessengerSettings extends Component {
  constructor(props) {
    super(props);
    this.mess = socials[this.props.currentMess];
    this.state = {
      updating: this.mess ? this.mess.updating : null,
      watching: this.mess ? this.mess.watching : null,
      connection: false,
      waiting: true,
      dialogs: []
    };

    if (window.location.search) {
      let code = window.location.search.split("=")[1];
      axios
        .post("api/v1/dialogs/vk?api_token=" + apiToken, { code: code })
        .then(response => {
          if (response.data.success) {
            connectDialogs(response.data.dialogs);
          }
        });
    }

    if (this.state.watching === "dialogs") {
      axios
        .get(
          "api/v1/messengers/settings/" +
            this.mess.id +
            "/getDialogs?api_token=" +
            apiToken
        )
        .then(response => {
          this.setState({ dialogs: response.data.dialogs, waiting: false });
        });
    }
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
    if (/vk||inst||wapp||tlgrm/.test(mess)) {
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

  waitingOn = () => {
    this.setState({ waiting: true });
  };

  connectionOn = () => {
    this.setState({ connection: true });
  };

  connectDialogs = dialogList => {
    let dialogs = this.props.currentMess === "vk" ? [] : this.state.dialogs;
    dialogList.forEach(dialog => {
      dialogs.push(dialog);
    });
    this.setState(() =>
      this.state.waiting
        ? { dialogs, waiting: false }
        : { dialogs, connection: false }
    );
  };

  deleteDialog = dialog => {
    axios.delete("api/v1/dialogs/" + dialog + "?api_token=" + apiToken);
    let { dialogs } = this.state;
    dialogs.splice(dialogs.map(x => x.id).indexOf(dialog), 1);
    this.setState({ dialogs });
  };

  dialogsHeight = () => {
    return (
      $(".settings-wrapper").height() -
      $(".module-setting")
        .eq(0)
        .outerHeight() -
      $(".module-setting")
        .eq(1)
        .outerHeight() -
      $(".module-setting")
        .eq(2)
        .outerHeight() +
      "px"
    );
  };

  render() {
    let { updating, watching, dialogs, waiting, connection } = this.state;
    let mess = this.props.currentMess;
    return (
      <div className="module-settings">
        <div className="settings-wrapper">
          <div className="settings d-flex flex-column">
            <div className="module-setting">
              <div className="col-7 setting-name">
                {translate("settings.updating")}
              </div>
              <div className="setting-value d-flex justify-content-center col-5">
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
              <div className="setting-value d-flex justify-content-center col-5">
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
              <Fragment>
                <div className="module-setting">
                  {mess !== "vk" ? (
                    connection ? (
                      <Waiting />
                    ) : (
                      <DialogsConnection
                        mess={mess}
                        connectDialogs={this.connectDialogs}
                        connectionOn={this.connectionOn}
                      />
                    )
                  ) : (
                    <VkRefresh
                      connectDialogs={this.connectDialogs}
                      waitingOn={this.waitingOn}
                    />
                  )}
                </div>
                <div
                  className="module-setting d-flex justify-content-center"
                  style={{ height: this.dialogsHeight() }}
                >
                  {waiting ? (
                    <Waiting />
                  ) : dialogs.length > 0 ? (
                    <Dialogs
                      dialogs={dialogs}
                      withController
                      deleteDialog={this.deleteDialog}
                      mess={mess}
                    />
                  ) : (
                    <div className="no-messages-wrapper">
                      <div className="no-messages">
                        {translate("all.info.dialog-list")}
                      </div>
                    </div>
                  )}
                </div>
              </Fragment>
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
