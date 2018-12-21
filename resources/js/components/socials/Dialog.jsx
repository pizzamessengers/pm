import React, { Component } from "react";

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.dialog = this.props.match.params.dialog;
    this.id = this.props.location.state.id;
    this.name = this.props.location.state.name;
  }

  componentWillMount() {
    axios
      .get(
        "./../../api/v1/messages/" + this.id + "?api_token=" + user.apiToken
      )
      .then(response => {
        this.setState({ messages: response.data });
      });
  }

  render() {
    let { messages } = this.state;
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                {this.name}
              </div>

              <div className="w-50 mx-auto my-4">
                <div>Тут потом можно будет написать сообщение</div>
                <input placeholder="типа вот так..." className="my-3"></input>
                <button>И отправить</button>
              </div>

              <div className="card-body">
                <ul className="navbar-nav">
                  {messages.map(message => {
                    return (
                      <li className="nav-item d-flex my-1" key={message.id}>
                        <img className="mr-4" src={message.author.avatar}  width={50+'px'} height={50+'px'}/>
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
