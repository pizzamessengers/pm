import React, { Component, Fragment } from "react";

export default class Wapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    };
    this.token = null;
    this.url = null;
    this.qr = null;
    this.stages = [
      <Fragment>
        <div className="operation">
          <a
            target="_blank"
            className="btn btn-primary"
            href="https://app.chat-api.com"
            onClick={() => {
              this.setState({ connectionStage: 1 });
            }}
          >
            Получить токен
          </a>
        </div>
        <div className="instruction">
          <div className="text">
            Нужно получить токен
          </div>
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <input id="url" type="text" placeholder="api url" />
          <input id="token" type="text" placeholder="token" />
          <button onClick={this.installWapp}>Зарегистрировать</button>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
            <div className="watching-choosing" onClick={() => this.connect('all')}>all</div>
            <div className="watching-choosing" onClick={() => this.connect('dialogs')}>dialogs</div>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>
    ];
  }

  installWapp = () => {
    e.preventDefault();
    this.token = $("#token").val();
    this.url = $("#url").val();
    axios.get(this.url + "status?token=" + this.token).then(response => {
      switch (response.data.accountStatus) {
        case "got qr code":
          alert("просканируйте код");
          break;
        case "loading":
          this.installWapp();
          break;
        case "authenticated":
          this.setState({ stage: 2 });
          break;
      }
    });
  };

  connect = watching => {
    if (this.token) {
      this.props.connect(
        "wapp",
        {
          url: this.url,
          token: this.token
        },
        watching,
      );
    }
  };

  render() {
    let { stage } = this.state;
    return this.stages[stage];
  }
}
