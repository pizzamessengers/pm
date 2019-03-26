import React, { Component, Fragment } from "react";
import Waiting from "./../elements/Waiting";

export default class Inst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    };
    this.loginRef = React.createRef();
    this.passwordRef = React.createRef();
    this.stages = [
      <Fragment>
        <div className="operation">
          <form
            className="form"
            onSubmit={e => {
              e.preventDefault();
              this.processData(e);
            }}
          >
            <input type="text" placeholder="login" ref={this.loginRef} required />
            <input type="password" placeholder="password" ref={this.passwordRef} required />
            <input type="submit" className="main-button" value="Далее" />
          </form>
        </div>
        <div className="instruction">
          <div className="text">Тут крч введите логин и пароль от инсты</div>
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
    this.login = null;
    this.password = null;
  }

  componentDidMount() {
    $(".progress-bar").css("width", "33.3333333333%");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stage !== prevState.stage) {
      $(".progress-bar").css(
        "width",
        (100 / this.stages.length) * (this.state.stage + 1) + "%"
      );
    }
  }

  processData = e => {
    e.preventDefault();
    this.login = this.loginRef.current.value;
    this.password = this.passwordRef.current.value;
    this.setState({ stage: 1 });
  };

  connect = watching => {
    this.setState({ stage: 2 });
    if (this.login && this.password) {
      this.props.connect(
        "inst",
        {
          login: this.login,
          password: this.password
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
