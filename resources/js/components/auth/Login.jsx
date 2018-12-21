import React, { Component } from "react";
import Auth from "./../../contexts/Auth";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    let data = {
      email: this.state.email,
      password: this.state.password
    };
    axios.post("login", data).then(response => {
      response.data.success
        ? ((user = response.data.user),
          this.props.history.push(response.data.redirect),
          this.context.checkAuth())
        : alert(response.data.message);
    });
  };

  handleInput = (field, e) => {
    this.setState({
      [field]: $(e.target).val()
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Login</div>

              <div className="card-body">
                <form onSubmit={e => this.handleSubmit(e)}>
                  <div className="form-group row">
                    <label
                      htmlFor="email"
                      className="col-sm-4 col-form-label text-md-right"
                    >
                      E-Mail Address
                    </label>

                    <div className="col-md-6">
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        name="email"
                        required
                        autoFocus
                        onChange={e => this.handleInput("email", e)}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="password"
                      className="col-md-4 col-form-label text-md-right"
                    >
                      Password
                    </label>

                    <div className="col-md-6">
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        name="password"
                        required
                        onChange={e => this.handleInput("password", e)}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-6 offset-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="remember"
                          id="remember"
                        />

                        <label className="form-check-label" htmlFor="remember">
                          Remember Me
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group row mb-0">
                    <div className="col-md-8 offset-md-4">
                      <button type="submit" className="btn btn-primary">
                        Login
                      </button>

                      <a className="btn btn-link" href="http://localhost:8000/">
                        Forgot Your Password?
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.contextType = Auth;
