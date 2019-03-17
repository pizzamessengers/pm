import React, { Component, Fragment } from "react";
import Messages from "./Messages";
import Waiting from "./../../elements/Waiting";

export default class MessengerMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: true,
      messages: []
    };

    this.interval;
  }

  componentWillMount() {
    axios
      .get(
        "api/v1/messengers/" +
          socials[this.props.mess].id +
          "?api_token=" +
          apiToken
      )
      .then(response => {
        if (this.state.messages.length !== response.data.messages.length) {
          this.setState({ messages: response.data.messages });
        }
        this.setState({ waiting: false });
      });
    this.interval = setInterval(() => {
      axios
        .get(
          "api/v1/messengers/" +
            socials[this.props.mess].id +
            "?api_token=" +
            apiToken
        )
        .then(response => {
          if (this.state.messages.length !== response.data.messages.length) {
            this.setState({ messages: response.data.messages });
          }
        });
    }, 5000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.mess !== prevProps.mess) {
      this.setState({ waiting: true, messages: [] });
      axios
        .get(
          "api/v1/messengers/" +
            socials[this.props.mess].id +
            "?api_token=" +
            apiToken
        )
        .then(response => {
          if (this.state.messages.length !== response.data.messages.length) {
            this.setState({ messages: response.data.messages });
          }
          this.setState({ waiting: false });
        });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { waiting, messages } = this.state;
    console.log();
    return waiting ? <Waiting /> : <Messages messages={messages} />;
  }
}
