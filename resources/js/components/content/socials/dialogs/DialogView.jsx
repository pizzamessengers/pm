import React, { Component, Fragment } from "react";
import Messages from "./../messages/Messages";
import Waiting from "./../../elements/Waiting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class DialogView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: true,
      messages: []
    };

    this.text = React.createRef();
    this.dialogId = this.props.match.params.dialogId;
    this.mess = this.props.match.params.messenger;
    this.interval;
    this.textSize;
  }

  componentWillMount() {
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

  componentDidMount() {
    $(".card-header").addClass(this.mess);
    this.textSize = this.text.current.scrollHeight;
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

  handleChangeText = () => {
    if (this.text.current.scrollHeight !== this.textSize) {
      let rows = Math.floor((this.textSize - 46) / 20.8 + 1);
      $(".card-body .list-wrapper").css(
        "height",
        "calc(90% - " + rows * 26 + "px)"
      );
      $(".card-footer").css("height", "calc(10% + " + rows * 26 + "px)");

      this.textSize = this.text.current.scrollHeight;
    }

    if (this.text.current.value.length > 0) {
      $(".send-message button").addClass("allow-send");
    } else $(".send-message button").removeClass("allow-send");
  };

  sendMessage = e => {
    e.preventDefault();
    let text = this.text.current.value;

    if (text !== "") {
      this.text.current.value = "";
      let { messages } = this.state;
      messages.push({
        from_me: 1,
        text: text,
        attachments: []
      });
      this.setState({ messages });

      let data = {
        mess: this.mess,
        dialogId: this.dialogId,
        text: text
      };
      axios.post("api/v1/messages/send?api_token=" + apiToken, data);
    }
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

          <div className="card-footer send-message-wrapper">
            <div className="send-message">
              <form onSubmit={e => this.sendMessage(e)}>
                <input type="file" id="file" className="d-none" />
                <label htmlFor="file">
                  <FontAwesomeIcon
                    className="icon"
                    icon={["fas", "share-square"]}
                  />
                </label>
                <textarea
                  ref={this.text}
                  placeholder="текст сообщения"
                  onChange={this.handleChangeText}
                />
                <button type="submit">
                  <FontAwesomeIcon
                    className="icon"
                    icon={["fas", "arrow-right"]}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
