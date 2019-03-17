import React, { Component, Fragment } from "react";

export default class Wapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionStage: !socials.wapp ? 0 : null
    };
    this.token = null;
    this.url = null;
    this.qr = null;
  }

  installWapp = e => {
    e.preventDefault();
    this.token = $("#token").val();
    this.url = $("#url").val();
    axios.get(this.url + "status?token=" + this.token).then(response => {
      switch (response.data.accountStatus) {
        case "got qr code":
          alert("просканируйте код");
          break;
        case "loading":
          this.installWapp(e);
          break;
        case "authenticated":
          this.setState({ connectionStage: 2 });
          break;
      }
    });
  };

  render() {
    let { connect, remove } = this.props;
    let { connectionStage } = this.state;

    let connectionStages = [
      <a
        target="_blank"
        className="btn btn-primary"
        href="https://app.chat-api.com"
        onClick={() => {
          this.setState({ connectionStage: 1 });
        }}
      >
        Получить токен
      </a>,
      <div className="d-flex flex-column justify-content-center align-items-center">
        <input id="url" type="text" placeholder="api url" />
        <input id="token" type="text" placeholder="token" />
        <button onClick={this.installWapp}>Зарегистрировать</button>
      </div>,
      <div>
        <label htmlFor="all">
          <input type="radio" value="all" name="watching" id="all" />
          all
        </label>
        <label htmlFor="dialogs">
          <input type="radio" value="dialogs" name="watching" id="dialogs" />
          dialogs
        </label>
        <button
          onClick={e => {
            connect(
              "wapp",
              {
                url: this.url,
                token: this.token
              },
              $("input[name='watching']:checked").val(),
              e
            );
          }}
        >
          Зарегистрировать
        </button>
      </div>
    ];

    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        {connectionStages[connectionStage]}
      </div>
    );
  }
}
