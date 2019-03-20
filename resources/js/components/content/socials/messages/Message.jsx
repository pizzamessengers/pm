import React from "react";
import MessageFromMe from './MessageFromMe';
import MessageNotFromMe from './MessageNotFromMe';

const Message = ({ message, same }) =>
  message.from_me ? (
    <MessageFromMe
      message={message}
      same={same}
    />
  ) : (
    <MessageNotFromMe
      message={message}
      same={same}
    />
  );

export default Message;
