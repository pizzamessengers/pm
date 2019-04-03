import React, { Component } from "react";
import LinkedDialog from "./LinkedDialog";

const Dialogs = ({ dialogs, withController, fromMessagesWindow }) => (
  <div className="list-wrapper">
    <ul className="list">
      {dialogs.map((dialog, i) => (
        <li key={i} className="nav-item d-flex align-items-center my-1 w-100">
          <LinkedDialog
            dialog={dialog}
            mess={dialog.mess}
            fromMessagesWindow={fromMessagesWindow}
          />
        </li>
      ))}
    </ul>
  </div>
);

export default Dialogs;
