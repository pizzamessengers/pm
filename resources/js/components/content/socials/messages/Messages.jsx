import React, { Component, Fragment } from "react";
import timestamp from "./../../../../functions/timestamp";
import Message from "./Message";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    this.lastTimestamp = 0;
    this.timestamp = timestamp;
    this.needScrollToBot = true;
  }

  onLoadHandler = () => {
    if (this.props.id === 0) this.props.onLoadHandler();
  };

  shouldComponentUpdate() {
    this.lastTimestamp = 0;
    return true;
  }

  loadMessages = (messages, needScrollToBot = false) => {
    this.needScrollToBot = needScrollToBot;
    this.setState({ messages });
  };

  componentDidUpdate() {
    if (this.props.id === 0 && this.needScrollToBot) {
      this.props.scrollToBot();
      this.needScrollToBot = false;
    }
  }

  listTimestamp = timestamp => {
    if (this.lastTimestamp === 0 || timestamp - this.lastTimestamp > 3600000) {
      this.lastTimestamp = timestamp;
      return (
        <div className="list-timestamp">{this.timestamp(+timestamp, true)}</div>
      );
    }

    return null;
  };

  render() {
    let { messages } = this.state;
    let { double } = this.props;

    return messages.map((message, i) => (
      <Fragment key={i}>
        {this.listTimestamp(message.timestamp)}
        <li>
          <Message
            message={message}
            same={
              i > 0 && !message.from_me
                ? message.author.id === messages[i - 1].author.id
                : false
            }
            onLoadAtta={this.onLoadHandler}
            double={double}
          />
        </li>
      </Fragment>
    ));
  }
}
