import React, { Component } from "react";

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.location.state ? this.props.location.state.name : null,
      messages: []
    };

    this.dialog = this.props.match.params.dialog;
  }

  componentWillMount() {
    axios
      .get(
        "api/v1/messages/" + this.dialog + "?api_token=" + user.apiToken
      )
      .then(response => {
        this.setState(response.data);
      });
  }

  render() {
    let { messages } = this.state;
    let { name } = this.state;
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">{name}</div>

              <div className="w-50 mx-auto my-4">
                <div>Тут потом можно будет написать сообщение</div>
                <input placeholder="типа вот так..." className="my-3" />
                <button>И отправить</button>
              </div>

              <div className="card-body">
                <ul className="navbar-nav">
                  {messages.map(message => {
                    return (
                      <li className="nav-item d-flex my-1" key={message.id}>
                        <img
                          className="mr-4"
                          src={message.author.avatar}
                          width={50 + "px"}
                          height={50 + "px"}
                        />
                        author: {message.author.name}
                        <br />
                        text: {message.text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
