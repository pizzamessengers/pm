import React, { Component, Fragment } from "react";
import Messages from "./../messages/Messages";
import Waiting from "./../../elements/Waiting";
import SendMessage from "./../messages/SendMessage";

export default class DialogView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.location.state ? this.props.location.state.name : "",
      waiting: true,
      messages: []
    };

    this.dialogId = this.props.match.params.dialogId;
    this.mess = this.props.match.params.messenger;
    this.needCheck = false;
    this.double;

    axios
      .get("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
      .then(response => {
        this.setState({
          name: response.data.dialogName,
          messages: response.data.messages,
          waiting: false
        });

        this.double = response.data.double;
      });
    this.listenChannel();
  }

  componentDidMount() {
    $(".card-header").addClass(this.mess);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.dialogId !== prevProps.match.params.dialogId) {
      this.setState({ waiting: true });

      Echo.leaveChannel(`messages.${this.dialogId}`);

      this.dialogId = this.props.match.params.dialogId;
      this.mess = this.props.match.params.messenger;
      $(".card-header")
        .removeClass(prevProps.match.params.messenger)
        .addClass(this.mess);

      this.listenChannel();
    }
  }

  listenChannel = () => {
    Echo.private(`messages.${this.dialogId}`).listen(".messages.created", e => {
      let { messages } = this.state;
      if (!this.needCheck) {
        messages = messages.concat(e.messages);
      } else {
        let exists;
        for (var i = 0; i < e.messages.length; i++) {
          exists = false;

          if (e.messages[i].from_me) {
            for (var j = 1; j <= 50; j++) {
              if (
                e.messages[i].text === messages[messages.length - j].text &&
                e.messages[i].attacments ===
                  messages[messages.length - j].attacments
              ) {
                exists = true;
                break;
              }
            }

            if (exists) continue;
          }

          messages.push(e.messages[i]);
        }

        this.needCheck = false;
      }
      this.setState({ messages });
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

    this.needCheck = true;

    messages.push({
      from_me: 1,
      text: text,
      attachments: rightAtta
    });
    this.setState({ messages });
  };

  componentWillUnmount() {
    axios
      .post("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
    Echo.leaveChannel(`messages.${this.dialogId}`);
  }

  render() {
    let { waiting, messages } = this.state;
    return (
      <Fragment>
        <div className="card-header">{this.state.name}</div>

        <div className="card-body dialog-view">
          {waiting ? <Waiting /> : <Messages messages={messages} double={this.double} />}

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
