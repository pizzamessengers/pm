import React, { Component, Fragment } from "react";
import timestamp from "./../../../../functions/timestamp";
import Message from "./Message";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.lastTimestamp = 0;
    this.messagesWrapper = React.createRef();
    this.mw;
    this.timestamp = timestamp;
    this.messCount = 0; //нужно для componentDidUpdate. prevProps не работает
  }

  componentDidMount() {
    this.messCount = this.props.messages.length;
    this.mw = $(this.messagesWrapper.current);
    this.scrollToBot();
  }

  scrollToBot = () => {
    this.mw.scrollTop(this.mw[0].scrollHeight);
  };

  shouldComponentUpdate() {
    this.lastTimestamp = 0;
    return true;
  }

  componentDidUpdate() {
    //промотать вниз, если
    //1. нахожусь в самом низу и есть новые сообщения
    //2. до этого не было сообщений
    //3. я отправил сообщение
    let height = 0;
    for (let i = 1; i <= this.props.messages.length - this.messCount; i++) {
      height += $(this.mw)
        .children("ul")
        .children("li")
        .eq(-i)
        .height();
    }
    if (
      (this.props.messages.length !== this.messCount &&
        Math.floor(this.mw.scrollTop()) ===
          Math.floor(this.mw[0].scrollHeight) -
            Math.floor($(this.mw).height()) -
            Math.floor(height)) ||
      this.messCount === 0 ||
      this.props.messages[this.props.messages.length - 1].author == null
    )
      this.scrollToBot();

    this.messCount = this.props.messages.length;
  }

  onLoadHandler = () => {
    this.scrollToBot();
  };

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
    let { messages, double } = this.props;

    return (
      <div className="list-wrapper" ref={this.messagesWrapper}>
        <ul className="list navbar-nav">
          {messages.map((message, i) => (
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
          ))}
        </ul>
      </div>
    );
  }
}
