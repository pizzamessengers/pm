import React, { Component } from "react";
import Waiting from "./content/elements/Waiting";
import Dialogs from "./content/socials/dialogs/Dialogs";

export default class MessagesWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: true,
      dialogs: []
    };

    this.interval;

    axios.get("api/v1/user/getDialogs?api_token=" + apiToken).then(response => {
      this.setState({ dialogs: response.data.dialogs, waiting: false });
    });
    this.interval = setInterval(() => {
      axios
        .get("api/v1/user/getDialogs?api_token=" + apiToken)
        .then(response => {
          this.setState({ dialogs: response.data.dialogs });
        });
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { waiting, dialogs } = this.state;
    return (
      <div className="messagesWindow">
        {waiting ? (
          <Waiting />
        ) : dialogs.length > 0 ? (
          <Dialogs dialogs={dialogs} fromMessagesWindow={true} />
        ) : (
          <div className="no-messages-wrapper">
            <div className="no-messages">
              В это окне будут отображаться диалоги со всех мессенджеров
            </div>
          </div>
        )}
      </div>
    );
  }
}
