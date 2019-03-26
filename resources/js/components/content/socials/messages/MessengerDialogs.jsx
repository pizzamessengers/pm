import React, { Component, Fragment } from "react";
import Dialogs from "./../dialogs/Dialogs";
import Waiting from "./../../elements/Waiting";

export default class MessengerDialogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: true,
      dialogs: []
    };

    this.interval;
  }

  componentWillMount() {
    axios
      .get(
        "api/v1/messengers/" +
          socials[this.props.mess].id +
          "/getDialogs?api_token=" +
          apiToken
      )
      .then(response => {
        this.setState({ dialogs: response.data.dialogs, waiting: false });
      });
    this.interval = setInterval(() => {
      axios
        .get(
          "api/v1/messengers/" +
            socials[this.props.mess].id +
            "/getDialogs?api_token=" +
            apiToken
        )
        .then(response => {
          this.setState({ dialogs: response.data.dialogs });
        });
    }, 5000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.mess !== prevProps.mess) {
      this.setState({ waiting: true, dialogs: [] });
      axios
        .get(
          "api/v1/messengers/" +
            socials[this.props.mess].id +
            "/getDialogs?api_token=" +
            apiToken
        )
        .then(response => {
          this.setState({ dialogs: response.data.dialogs, waiting: false });
        });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { waiting, dialogs } = this.state;
    let { mess } = this.props;
    return waiting ? (
      <Waiting />
    ) : dialogs.length > 0 ? (
      <Dialogs dialogs={dialogs} />
    ) : (
      <div className="no-messages-wrapper">
        <div className="no-messages">
          В этом окне будут отображаться диалоги данного мессенджера
        </div>
      </div>
    );
  }
}
