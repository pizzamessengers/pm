import React, { Component } from "react";
import Waiting from "./content/elements/Waiting";
import Messages from "./content/socials/messages/Messages";

export default class MessagesWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: true,
      messages: []
    };

    this.interval;
  }

  componentWillMount() {
    axios.get("api/v1/messages?api_token=" + apiToken).then(response => {
      if (this.state.messages.length !== response.data.messages.length) {
        this.setState({ messages: response.data.messages });
      }
      this.setState({ waiting: false });
    });
    this.interval = setInterval(() => {
      axios.get("api/v1/messages?api_token=" + apiToken).then(response => {
        if (this.state.messages.length !== response.data.messages.length) {
          this.setState({ messages: response.data.messages });
        }
      });
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { waiting, messages } = this.state;
    return (
      <div className="messagesWindow">
        {waiting ? (
          <Waiting />
        ) : (
          <Messages messages={messages} fromMessagesWindow={true} />
        )}
      </div>
    );
  }
}
