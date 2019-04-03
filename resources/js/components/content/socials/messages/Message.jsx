import React from "react";
import MessageFromMe from './MessageFromMe';
import MessageNotFromMe from './MessageNotFromMe';

const Message = ({ message, same, onLoadAtta }) =>
  message.from_me ? (
    <MessageFromMe
      message={message}
      same={same}
      onLoadAtta={onLoadAtta}
    />
  ) : (
    <MessageNotFromMe
      message={message}
      same={same}
      onLoadAtta={onLoadAtta}
    />
  );

export default Message;
