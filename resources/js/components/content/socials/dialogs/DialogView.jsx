import React, { Component, Fragment } from "react";
import MessagesList from "./../messages/MessagesList";
import Waiting from "./../../elements/Waiting";
import SendMessage from "./../messages/SendMessage";

export default class DialogView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.location.state ? this.props.location.state.name : "",
      waiting: true
    };

    this.messagesList = React.createRef();
    this.messages = [];
    this.MESSAGES_LENGTH = 20;
    this.id = this.props.match.params.id;
    this.mess = this.props.match.params.messenger;
    this.needCheck = 0;
    this.isDouble;

    this.load();
  }

  componentDidMount() {
    $(".card-header").addClass(this.mess);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({
        name: this.props.location.state ? this.props.location.state.name : "",
        waiting: true
      });

      Echo.leaveChannel(`messages.${this.id}`);

      this.messages = [];
      this.needCheck = 0;
      this.id = this.props.match.params.id;
      this.mess = this.props.match.params.messenger;
      $(".card-header")
        .removeClass(prevProps.match.params.messenger)
        .addClass(this.mess);

      this.load();
    }
  }

  load = () => {
    axios
      .get("api/v1/dialogs/" + this.id + "?api_token=" + apiToken)
      .then(r => {
        this.splitMessages(r.data.messages);

        this.setState({
          name: r.data.dialogName,
          waiting: false
        });

        this.isDouble = r.data.double;
      });
    this.listenChannel();
  };

  splitMessages = messages => {
    let peaceOfMessages;
    let i = 0;
    while (i < messages.length) {
      peaceOfMessages =
        messages.length - i > this.MESSAGES_LENGTH * 2 - 1
          ? messages.slice(i, i + this.MESSAGES_LENGTH)
          : messages.slice(i, messages.length);
      this.messages.push(peaceOfMessages);

      i += peaceOfMessages.length;
    }
  };

  listenChannel = () => {
    Echo.private(`messages.${this.id}`).listen(".messages.created", e => {
      let messages = this.messages[this.messages.length - 1];
      if (!this.needCheck) {
        messages = messages.concat(e.messages);
        this.messages[this.messages.length - 1] = messages;
        this.messagesList.current.addMessage();
      } else {
        for (var i = 0; i < e.messages.length; i++) {
          if (e.messages[i].from_me) {
            for (var j = 1; j <= messages.length; j++) {
              if (
                messages[messages.length - j].timestamp === undefined &&
                e.messages[i].text === messages[messages.length - j].text &&
                e.messages[i].attachments.length ===
                  messages[messages.length - j].attachments.length
              ) {
                messages.splice(messages.length - j, 1, e.messages[i]);
                break;
              }
            }
          } else {
            messages.push(e.messages[i]);
          }
          this.messages[this.messages.length - 1] = messages;
          this.messagesList.current.addMessage();
          this.needCheck--;
        }
      }

      this.messages[this.messages.length - 1] = messages;
    });
  };

  addMessage = (text, attachments) => {
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

    this.needCheck++;

    this.messages[this.messages.length - 1].push({
      from_me: 1,
      text: text,
      attachments: rightAtta
    });

    this.messagesList.current.addMessage(true);
  };

  componentWillUnmount() {
    axios.post("api/v1/dialogs/" + this.id + "?api_token=" + apiToken);
    Echo.leaveChannel(`messages.${this.id}`);
  }

  render() {
    let { waiting } = this.state;
    return (
      <Fragment>
        <div className="card-header">{this.state.name}</div>

        <div className="card-body dialog-view">
          {waiting ? (
            <Waiting />
          ) : (
            <MessagesList
              messages={this.messages}
              isDouble={this.isDouble}
              ref={this.messagesList}
            />
          )}

          <div className="card-footer">
            <SendMessage
              addMessage={this.addMessage}
              mess={this.mess}
              id={this.id}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
