import React, { Component, Fragment } from "react";
import Dialogs from "./../dialogs/Dialogs";
import Waiting from "./../../elements/Waiting";

export default class MessengerMessages extends Component {
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
        if (this.state.dialogs.length !== response.data.dialogs.length) {
          this.setState({ dialogs: response.data.dialogs });
        }
        this.setState({ waiting: false });
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
          if (this.state.dialogs.length !== response.data.dialogs.length) {
            this.setState({ dialogs: response.data.dialogs });
          }
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
            "?api_token=" +
            apiToken
        )
        .then(response => {
          if (this.state.dialogs.length !== response.data.dialogs.length) {
            this.setState({ dialogs: response.data.dialogs });
          }
          this.setState({ waiting: false });
        });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { waiting, dialogs } = this.state;
    let { mess } = this.props;
    return waiting ? <Waiting /> : <Dialogs dialogs={dialogs} linked={true} />;
  }
}
