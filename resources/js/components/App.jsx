import React, { Fragment } from "react";
import MessagesWindow from "./MessagesWindow";
import Content from "./content/Content";
import Menu from "./menu/Menu";

const App = ({ history }) => (
  <div className="wrapper">
    <MessagesWindow />
    <Menu />
    <Content />
  </div>
);

export default App;
