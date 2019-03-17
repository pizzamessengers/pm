import React from "react";
import DialogsConnection from "./dialogs/DialogsConnection";
import MessengerMessages from "./messages/MessengerMessages";

const ConnectedMessenger = ({ mess, watching }) =>
  watching === "dialogs" ? (
    <DialogsConnection mess={mess} />
  ) : (
    <MessengerMessages mess={mess} />
  );

export default ConnectedMessenger;
