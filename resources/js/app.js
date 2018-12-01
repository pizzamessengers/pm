/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require("./bootstrap");

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

/**
 * Importing components
 */

import Index from "./components/Index.jsx";

/**
 * Importing contexts
 */

import ApiToken from "./contexts/ApiToken";
import Auth from "./contexts/Auth";

class App extends Component {
  constructor(props) {
    super(props);

    this.checkAuth = () => {
      if (user.isAuth !== this.state.isAuth) {
        this.setState({ isAuth: user.isAuth });
      }
    };

    this.state = {
      isAuth: user.isAuth,
      checkAuth: this.checkAuth
    };
  }

  apiToken = () => {
    if (this.state.isAuth) {
      axios.get("api_token").then(response => {
        this.setState({ api_token: response });
      });
    }
  };

  render() {
    /**
     * CSRF
     */

    axios.defaults.headers.common["X-CSRF-TOKEN"] = user.csrf;

    return (
      <Auth.Provider value={this.state}>
        <BrowserRouter>
          <div>
            <Index />
          </div>
        </BrowserRouter>
      </Auth.Provider>
    );
  }
}

if (document.getElementById("root")) {
  render(<App />, document.getElementById("root"));
}
