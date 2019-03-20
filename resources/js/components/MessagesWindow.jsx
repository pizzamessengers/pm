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
  }

  componentWillMount() {
    axios.get("api/v1/user/getDialogs?api_token=" + apiToken).then(response => {
      if (this.state.dialogs.length !== response.data.dialogs.length) {
        this.setState({ dialogs: response.data.dialogs });
      }
      this.setState({ waiting: false });
    });
    this.interval = setInterval(() => {
      axios
        .get("api/v1/user/getDialogs?api_token=" + apiToken)
        .then(response => {
          if (this.state.dialogs.length !== response.data.dialogs.length) {
            this.setState({ dialogs: response.data.dialogs });
          }
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
        ) : (
          <Dialogs dialogs={dialogs} linked={true} fromMessagesWindow={true} />
        )}
      </div>
    );
  }
}
