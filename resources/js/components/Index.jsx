import { Route } from "react-router-dom";
import Header from "./Header.jsx";
import Main from "./Main.jsx";

import React from "react";

const Index = () => (
  <div>
    <Route component={Header} />
    <Main />
  </div>
);

export default Index;
