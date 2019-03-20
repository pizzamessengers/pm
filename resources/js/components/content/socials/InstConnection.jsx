import React, { Component, Fragment } from "react";

export default class Inst extends Component {
  constructor(props) {
    super(props);

    this.login = React.createRef();
    this.password = React.createRef();
  }

  render() {
    let { connect } = this.props;
    return (
      <form
        onSubmit={e => {
          connect(
            "inst",
            {
              login: this.login.current.value,
              password: this.password.current.value
            },
            $("input[name='watching']:checked").val(),
            e
          );
        }}
        className="d-flex flex-column justify-content-center align-items-center col-7"
      >
        <div>
          <input type="text" placeholder="login" ref={this.login} />
          <input type="text" placeholder="password" ref={this.password} />
        </div>
        <div className="my-2">
          <input type="radio" value="all" name="watching" id="all" />
          <label htmlFor="all">all</label>
          <input type="radio" value="dialogs" name="watching" id="dialogs" />
          <label htmlFor="dialogs">dialogs</label>
        </div>
        <div>
          <input type="submit" value="Зарегистрировать" />
        </div>
      </form>
    );
  }
}
