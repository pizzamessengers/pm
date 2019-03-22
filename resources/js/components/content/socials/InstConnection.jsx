import React, { Component, Fragment } from "react";

export default class Inst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    }
    this.login = React.createRef();
    this.password = React.createRef();
    this.stages = [
      <Fragment>
        <div className="operation">
          <input type="text" placeholder="login" ref={this.login} />
          <input type="text" placeholder="password" ref={this.password} />
        </div>
        <div className="instruction">
          <div className="text">
            Тут крч введите логин и пароль от инсты
          </div>
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <input type="text" placeholder="url" ref={this.urlInput} />
          <button onClick={this.processUrlInput}>Далее</button>
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

  connect = watching => {
    if (this.token) {
      this.props.connect(
        "inst",
        {
          login: this.login.current.value,
          password: this.password.current.value
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
