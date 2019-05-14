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

import App from "./components/App.jsx";

/**
 * FontAwesome
 */
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);
library.add(fas);

axios.defaults.baseURL = window.location.origin;

/**
 * Right height
 */
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

/**
 * vk open API init
 */

VK.init({
  apiId: 6869374
});



const Index = () => {
  /**
   * CSRF
   */
  //axios.defaults.headers.common["X-XSRF-TOKEN"] = this.xsrf();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/app" component={App} />
      </Switch>
    </BrowserRouter>
  );
};

if (document.getElementById("root")) {
  render(<Index />, document.getElementById("root"));
}
