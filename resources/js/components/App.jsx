import React from "react";
import MessagesWindow from "./MessagesWindow";
import Content from "./content/Content";
import Menu from "./menu/Menu";

const App = () => (
  <div className="wrapper">
    <MessagesWindow />
    <Menu />
    <Content />
  </div>
);

export default App;
