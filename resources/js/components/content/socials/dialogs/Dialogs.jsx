import React, { Component } from "react";
import LinkedDialog from "./LinkedDialog";

const Dialogs = ({ dialogs, withController, fromMessagesWindow }) =>
  dialogs.length > 0 ? (
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
  ) : (
    <div className="no-messages-wrapper">
      <div className="no-messages">
        У вас еще не было новых сообщений с момента запуска сервиса
      </div>
    </div>
  );

export default Dialogs;
