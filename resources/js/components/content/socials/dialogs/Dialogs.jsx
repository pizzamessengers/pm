import React, { Component } from "react";
import LinkedDialog from "./LinkedDialog";
import DialogController from "./DialogController";

const Dialogs = ({
  dialogs,
  withController,
  deleteDialog,
  mess,
  fromMessagesWindow
}) => (
  <div className="list-wrapper">
    <ul className="list">
      {dialogs.map((dialog, i) => (
        <li key={i} className="nav-item d-block my-1 w-100">
          {withController ? (
            <DialogController
              dialog={dialog}
              deleteDialog={deleteDialog}
              mess={mess}
            />
          ) : (
            <LinkedDialog
              dialog={dialog}
              mess={dialog.mess}
              fromMessagesWindow={fromMessagesWindow}
            />
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Dialogs;
