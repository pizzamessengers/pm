import React, { Fragment } from "react";
import MessagesWindow from "./MessagesWindow";
import Content from "./content/Content";
import Menu from "./menu/Menu";
import History from "./../contexts/History";

const App = ({ history }) => (
  <div className="wrapper">
    <History.Provider value={history}>
      <MessagesWindow />
      <Menu />
      <Content />
    </History.Provider>
  </div>
);

export default App;
