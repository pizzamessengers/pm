import React, { Component, Fragment } from "react";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      list: 1
    };

    this.interval;
  }

  componentWillMount() {
    axios
      .get(
        "api/v1/messengers/" +
          socials[this.props.mess].id +
          "?api_token=" +
          apiToken
      )
      .then(response => {
        if (this.state.messages.length !== response.data.messages.length) {
          this.setState({ messages: response.data.messages });
        }
      });
    this.interval = setInterval(() => {
      axios
        .get(
          "api/v1/messengers/" +
            socials[this.props.mess].id +
            "?api_token=" +
            apiToken
        )
        .then(response => {
          if (this.state.messages.length !== response.data.messages.length) {
            this.setState({ messages: response.data.messages });
          }
        });
    }, 5000);
  }

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
      <Fragment>
        <ul className="navbar-nav">
          {messages.map((message, index) => {
            if (index >= list * 10 - 10 && index < list * 10) {
              return (
                <li
                  className="nav-item d-flex my-1 align-items-center"
                  key={message.id}
                >
                  <img
                    className="mr-4"
                    src={message.author.avatar}
                    width={50 + "px"}
                    height={50 + "px"}
                  />
                  <div>
                    <div className="d-flex mb-2">
                      <div className="mr-2">
                        <b>author:</b>{" "}
                        {message.author.first_name +
                          " " +
                          message.author.last_name}
                      </div>
                      <div>
                        <b>dialog:</b> {message.dialog}
                      </div>
                    </div>
                    <div>
                      {message.text}
                      <br />
                      {message.attachments.map(attachment => {
                        switch (attachment.type) {
                          case "photo":
                            return (
                              <img src={attachment.url} key={attachment.url} />
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
                              <Fragment key={attachment.url}>
                                {attachment.url ===
                                "https://vk.com/images/camera_100.png" ? (
                                  <div>удаленное видео</div>
                                ) : null}
                                <iframe
                                  src={attachment.url}
                                  width="100%"
                                  frameBorder="0"
                                  allowFullScreen
                                />
                              </Fragment>
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
      </Fragment>
    );
  }
}
