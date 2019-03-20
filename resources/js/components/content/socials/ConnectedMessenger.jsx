import React from "react";
import DialogsConnection from "./dialogs/DialogsConnection";
import MessengerDialogs from "./messages/MessengerDialogs";

const ConnectedMessenger = ({ mess, watching }) =>
  watching === "dialogs" ? (
    <DialogsConnection mess={mess} />
  ) : (
    <MessengerDialogs mess={mess} />
  );

export default ConnectedMessenger;
