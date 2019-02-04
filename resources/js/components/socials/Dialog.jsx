import React, { Component } from "react";

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      list: 1
    };

    this.text = React.createRef();
    this.dialogId = this.props.match.params.dialogId;
    this.interval;
  }

  componentWillMount() {
    axios
      .get("api/v1/dialogs/" + this.dialogId + "?api_token=" + apiToken)
      .then(response => {
        if (this.state.messages.length !== response.data.messages.length) {
          this.setState({ messages: response.data.messages });
        }
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
    return socials[this.props.match.params.messenger].dialogList.map(dialog => {
      if (dialog.id == this.dialogId) {
        return dialog.name;
      }
    });
  };

  sendMessage = e => {
    e.preventDefault();
    let data = {
      text: this.text.current.value,
      dialogId: this.dialogId
    };
    axios.post("api/v1/messages/send?api_token=" + apiToken, data)
    .then(function(response) {
      //console.log(response.data);
    });
  };

  listing = () => {
    let list = [];
    for (var i = 1; i <= Math.ceil(this.state.messages.length / 10); i++) {
      list.push(
        <li className="mx-1" key={i}>
          <a
            role="button"
            className="btn btn-success px-2"
            list={i}
            onClick={e => {
              this.setState({ list: $(e.target).attr("list") });
            }}
          >
            {i}
          </a>
        </li>
      );
    }
    return list;
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { messages, list } = this.state;
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">{this.name()}</div>

              <div className="w-50 mx-auto my-4">
                <form onSubmit={e => this.sendMessage(e)}>
                  <input
                    type="text"
                    ref={this.text}
                    placeholder="текст сообщения"
                  />
                  <input type="submit" value="Отправить" />
                </form>
              </div>

              <div className="card-body">
                <ul className="navbar-nav">
                  {messages.map((message, index) => {
                    if (index >= list * 10 - 10 && index < list * 10) {
                      return (
                        <li className="nav-item d-flex my-1" key={message.id}>
                          <img
                            className="mr-4"
                            src={message.author.avatar}
                            width={50 + "px"}
                            height={50 + "px"}
                          />
                          <div>
                            <div className="mb-2">
                              <b>author:</b>
                              {message.author.first_name +
                                " " +
                                message.author.last_name}
                            </div>
                            <div>
                              {message.text}
                              <br />
                              {message.attachments.map(attachment => {
                                switch (attachment.type) {
                                  case "photo":
                                    return (
                                      <img
                                        src={attachment.url}
                                        key={attachment.url}
                                      />
                                    );
                                    break;
                                  case "audio":
                                    return (
                                      <Fragment key={attachment.url}>
                                        <div>{attachment.name}</div>
                                        <audio controls src={attachment.url} />
                                      </Fragment>
                                    );
                                    break;
                                  case "video":
                                    return (
                                      <iframe
                                        key={attachment.url}
                                        src={attachment.url}
                                        width="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                      />
                                    );
                                    break;
                                }
                              })}
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
                <ul
                  className="d-flex justify-content-center align-items-center p-0 mb-0 mt-3"
                  style={{ listStyle: "none" }}
                >
                  {this.listing()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
