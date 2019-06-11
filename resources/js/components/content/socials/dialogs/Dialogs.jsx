import React, { Component } from "react";
import LinkedDialog from "./LinkedDialog";
import DialogController from "./DialogController";

const Dialogs = ({
  dialogs,
  withController,
  deleteDialog,
  mess,
  fromMessagesWindow
}) => {
  if (!withController) {
    let counter = 0;
    for (let i = 0; i < dialogs.length; i++) {
      if (dialogs[i].updating === 1) {
        counter++;
        break;
      }
    }
    if (counter === 0)
      return (
        <div className="no-messages-wrapper">
          <div className="no-messages">
            <div className="operation">
              <img
                src={
                  window.location.origin +
                  "/storage/connectionInstructions/vk_2.png"
                }
              />
            </div>
            <div className="instruction-wrapper">
              <div className="instruction">
                <div className="step">
                  <div className="text">
                    {translate("all.info.dialog-connection")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }

  let element = dialog => {
    if (withController)
      return (
        <DialogController
          dialog={dialog}
          deleteDialog={deleteDialog}
          mess={mess}
        />
      );
    else if (dialog.updating)
      return (
        <LinkedDialog
          dialog={dialog}
          fromMessagesWindow={fromMessagesWindow}
        />
      );
    else return null;
  };

  return (
    <div className="list-wrapper">
      <ul className="list">
        {dialogs.map((dialog, i) => (
          <li key={i} className="nav-item d-block my-1 w-100">
            {element(dialog)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dialogs;
