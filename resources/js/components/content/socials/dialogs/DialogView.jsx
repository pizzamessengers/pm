import React, { Component, Fragment } from "react";
import Messages from "./../messages/Messages";
import Waiting from "./../../elements/Waiting";

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
  }

  componentWillMount() {
    axios
      .get("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
      .then(response => {
        if (this.state.messages.length !== response.data.messages.length) {
          this.setState({ messages: response.data.messages });
        };
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

  name = () => {
    return this.props.location.state
      ? this.props.location.state.name
      : socials[this.mess].dialogList.map(dialog => {
          if (dialog.id == this.dialogId) {
            return dialog.name;
          }
        });
  };

  sendMessage = e => {
    e.preventDefault();
    let data = {
      mess: this.mess,
      dialogId: this.dialogId,
      text: this.text.current.value
    };
    axios
      .post("api/v1/messages/send?api_token=" + apiToken, data)
      .then(function(response) {});
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
                <input
                  type="text"
                  ref={this.text}
                  placeholder="текст сообщения"
                />
                <input type="submit" value="Отправить" />
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
