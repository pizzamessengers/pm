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

import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

/**
 * Importing components
 */

import Socials from "./components/socials/Socials.jsx";

/**
 * Importing contexts
 */

//

axios.defaults.baseURL = "http://localhost:8000";

const App = () => {
  /**
   * CSRF
   */
  //axios.defaults.headers.common["X-XSRF-TOKEN"] = this.xsrf();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/socials" component={Socials} />
      </Switch>
    </BrowserRouter>
  );
};

if (document.getElementById("root")) {
  render(<App />, document.getElementById("root"));
}
