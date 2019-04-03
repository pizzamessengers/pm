import React, { Component, Fragment } from "react";
import Messages from "./../messages/Messages";
import Waiting from "./../../elements/Waiting";
import SendMessage from "./../messages/SendMessage";

export default class DialogView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: true,
      messages: []
    };

    this.dialogId = this.props.match.params.dialogId;
    this.mess = this.props.match.params.messenger;
    this.interval;

    axios
      .get("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
      .then(response => {
        this.setState({ messages: response.data.messages, waiting: false });
      });
    this.interval = setInterval(() => {
      axios
        .get("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
        .then(response => {
          let sm = this.state.messages,
            rm = response.data.messages;
          if (
            rm.length > sm.length ||
            (sm.length > 0 &&
              sm[sm.length - 1].timestamp !== rm[rm.length - 1].timestamp)
          ) {
            this.setState({ messages: response.data.messages });
          }
        });
    }, 5000);
  }

  componentDidMount() {
    $(".card-header").addClass(this.mess);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.dialogId !== prevProps.match.params.dialogId) {
      this.setState({ waiting: true });
      this.dialogId = this.props.match.params.dialogId;
      this.mess = this.props.match.params.messenger;
      clearInterval(this.interval);
      $(".card-header")
        .removeClass(prevProps.match.params.messenger)
        .addClass(this.mess);

      axios
        .get("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
        .then(response => {
          if (this.state.messages.length !== response.data.messages.length) {
            this.setState({ messages: response.data.messages });
          }
          this.setState({ waiting: false });
        });
      this.interval = setInterval(() => {
        axios
          .get("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
          .then(response => {
            if (this.state.messages.length !== response.data.messages.length) {
              this.setState({ messages: response.data.messages });
            }
          });
      }, 5000);
    }
  }

  name = () => {
    return this.props.location.state
      ? this.props.location.state.name
      : socials[this.mess].dialogList.map(dialog => {
          if (dialog.id == this.dialogId) {
            return dialog.name;
          }
        });
  };

  addMessage = (text, attachments) => {
    let { messages } = this.state;
    let rightAtta = [],
      type,
      name,
      url;
    attachments.forEach(attachment => {
      type = attachment.type.substr(0, attachment.type.indexOf("/"));
      name = attachment.name;
      url = attachment.path;
      rightAtta.push({
        type: type,
        name: name,
        url: url
      });
    });

    messages.push({
      from_me: 1,
      text: text,
      attachments: rightAtta
    });
    this.setState({ messages });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { waiting, messages } = this.state;
    return (
      <Fragment>
        <div className="card-header">{this.name()}</div>

        <div className="card-body dialog-view">
          {waiting ? <Waiting /> : <Messages messages={messages} />}

          <div className="card-footer">
            <SendMessage
              addMessage={this.addMessage}
              mess={this.mess}
              dialogId={this.dialogId}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
