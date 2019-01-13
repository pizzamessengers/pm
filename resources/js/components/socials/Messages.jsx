import React, { Component } from "react";

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentWillMount() {
    setInterval(() => {
      axios
        .get(
          "api/v1/messengers/" +
            socials[this.props.mess].id +
            "?api_token=" +
            apiToken
        )
        .then(response => {
          if (this.state.messages != response.data.messages) {
            this.setState( response.data );
          }
        });
    }, 5000);
  }

  render() {
    let { messages } = this.state;
    return (
      <ul className="navbar-nav">
        {messages.map(message => (
          <li className="nav-item d-flex my-1" key={message.id}>
            <img
              className="mr-4"
              src={message.author.avatar}
              width={50 + "px"}
              height={50 + "px"}
            />
            author: {message.author.first_name + ' ' + message.author.last_name}
            <br />
            text: {message.text}
          </li>
        ))}
      </ul>
    );
  }
}
