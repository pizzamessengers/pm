import React from "react";
import MessageFromMe from './MessageFromMe';
import MessageNotFromMe from './MessageNotFromMe';

const Message = ({ message, same, fromMessagesWindow, fromDialogView }) =>
  message.from_me ? (
    <MessageFromMe
      message={message}
      same={same}
      fromMessagesWindow={fromMessagesWindow}
      fromDialogView={fromDialogView}
    />
  ) : (
    <MessageNotFromMe
      message={message}
      same={same}
      fromMessagesWindow={fromMessagesWindow}
      fromDialogView={fromDialogView}
    />
  );

export default Message;
