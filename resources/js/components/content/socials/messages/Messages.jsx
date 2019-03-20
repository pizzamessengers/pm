import React, { Component } from "react";
import Message from "./Message";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.messagesWrapper = React.createRef();
  }

  componentDidMount() {
    let mw = $(this.messagesWrapper.current);
    mw.scrollTop(mw[0].scrollHeight);
  }

  componentDidUpdate(prevProps) {
    let mw = $(this.messagesWrapper.current);
    //промотать вниз, если
    //1. нахожусь в самом низу и есть новые сообщения
    //2. до этого не было сообщений
    //3. я отправил сообщение
    if (
      (this.props.messages !== prevProps.messages &&
        mw.scrollTop() === mw[0].scrollHeight) ||
      prevProps.messages.length === 0
      // TODO: пункт 3 выше
    )
      mw.scrollTop(mw[0].scrollHeight);
  }

  render() {
    let { messages } = this.props;

    return (
      <div className="list-wrapper" ref={this.messagesWrapper}>
        <ul className="list navbar-nav">
          {messages.map((message, i) => (
            <li key={i}>
              <Message
                message={message}
                same={
                  i > 0
                    ? message.author.avatar === messages[i - 1].author.avatar
                    : false
                }
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}