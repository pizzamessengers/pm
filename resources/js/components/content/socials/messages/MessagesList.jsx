import React, { Component } from "react";
import Messages from "./Messages";

export default class MessagesList extends Component {
  constructor(props) {
    super(props);
    this.messagesWrapper = React.createRef();
    this.mw;
    //this.messCount = 0; //нужно для componentDidUpdate. prevProps не работает
    this.page = 0;
    this.peaces = [];
  }

  componentDidMount() {
    let { messages } = this.props;
    this.mw = $(this.messagesWrapper.current);

    this.moreMessages();

    //this.messCount = messages[messages.length - 1].length;

    $(".list-wrapper").on("scroll", e => {
      if (this.page < messages.length && this.mw.scrollTop() < 300) {
        this.moreMessages();
      }
    });
  }

  addMessage = (sending = false) => {
    let isOnBot =
      Math.abs(
        Math.floor(this.mw.scrollTop()) -
          Math.floor(this.mw[0].scrollHeight) +
          Math.floor($(this.mw).height())
      ) < 40;

    this.peaces[this.peaces.length - 1].current.loadMessages(
      this.props.messages[this.props.messages.length - 1],
      sending || isOnBot
    );
  };

  moreMessages = () => {
    let { messages, isDouble } = this.props;

    this.peaces[this.peaces.length - 1 - this.page].current.loadMessages(
      messages[messages.length - 1 - this.page],
      true
    );
    this.page++;
  };

  scrollToBot = () => {
    this.mw.scrollTop(this.mw[0].scrollHeight);
  };

  onLoadHandler = () => {
    this.scrollToBot();
  };

  /*componentDidUpdate() {
    let { messages } = this.props;
    //промотать вниз, если
    //1. нахожусь в самом низу и есть новые сообщения
    //2. до этого не было сообщений
    //3. я отправил сообщение
    let height = 0;
    for (
      let i = 1;
      i <= messages[messages.length - 1].length - this.messCount;
      i++
    ) {
      height += $(this.mw)
        .children("ul")
        .children("li")
        .eq(-i)
        .height();
    }
    if (
      (messages[messages.length - 1].length !== this.messCount &&
        Math.floor(this.mw.scrollTop()) ===
          Math.floor(this.mw[0].scrollHeight) -
            Math.floor($(this.mw).height()) -
            Math.floor(height)) ||
      this.messCount === 0
    ) {
      this.scrollToBot();
    }

    this.messCount = messages[messages.length - 1].length;
  }*/

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let { messages, isDouble } = this.props;

    return (
      <div className="list-wrapper" ref={this.messagesWrapper}>
        <ul className="list navbar-nav">
          {messages.map((message, i) => {
            this.peaces[i] = React.createRef();
            return (
              <Messages
                key={i}
                ref={this.peaces[i]}
                id={messages.length - 1 - i}
                messages={[]}
                isDouble={isDouble}
                onLoadHandler={this.onLoadHandler}
                scrollToBot={this.scrollToBot}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}
