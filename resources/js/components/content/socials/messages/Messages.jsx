import React, { Component } from "react";
import Message from "./Message";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.messagesWrapper = React.createRef();
  }

  componentDidMount() {
    console.log('mounted');
    let mw = $(this.messagesWrapper.current);
    setTimeout(() => {mw.scrollTop(mw[0].scrollHeight)}, 50);
  }

  componentDidUpdate(prevProps) {
    console.log('here');
    let mw = $(this.messagesWrapper.current);
    console.log(mw.scrollTop());
    console.log(mw[0].scrollHeight);
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
                  i > 0 && !message.from_me
                    ? message.author.id === messages[i - 1].author.id
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
