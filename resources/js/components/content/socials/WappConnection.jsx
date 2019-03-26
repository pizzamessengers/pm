import React, { Component, Fragment } from "react";
import Waiting from './../elements/Waiting';

export default class Wapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    };
    this.tokenRef = React.createRef();
    this.urlRef = React.createRef();
    this.stages = [
      <Fragment>
        <div className="operation">
          <a
            target="_blank"
            className="main-button"
            href="https://app.chat-api.com"
            onClick={() => this.setState({ stage: 1 })}
          >
            Получить токен
          </a>
        </div>
        <div className="instruction">
          <div className="text">Нужно получить токен</div>
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <form
            className="form"
            onSubmit={e => {
              e.preventDefault();
              this.installWapp();
            }}
          >
            <input type="text" placeholder="api url" ref={this.tokenRef} />
            <input type="text" placeholder="token" ref={this.urlRef} required />
            <input type="submit" className="main-button" value="Далее" required />
          </form>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <div
            className="watching-choosing"
            onClick={() => this.connect("all")}
          >
            all
          </div>
          <div
            className="watching-choosing"
            onClick={() => this.connect("dialogs")}
          >
            dialogs
          </div>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>,
      <Waiting />
    ];

    this.token = null;
    this.url = null;
    this.qr = null;
  }

  componentDidMount() {
    $(".progress-bar").css("width", "25%");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stage !== prevState.stage) {
      $(".progress-bar").css(
        "width",
        (100 / this.stages.length) * (this.state.stage + 1) + "%"
      );
    }
  }

  installWapp = () => {
    e.preventDefault();
    this.token = this.tokenRef.current.value;
    this.url = this.urlRef.current.value;
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
    this.setState({ stage: 3 });
    if (this.token && this.url) {
      this.props.connect(
        "wapp",
        {
          url: this.url,
          token: this.token
        },
        watching
      );
    }
  };

  render() {
    let { stage } = this.state;
    return this.stages[stage];
  }
}
