import React from "react";
import Attachments from "./attachments/Attachments";

const MessageNotFromMe = ({ message, same }) => (
  <div className="message d-flex float-left">
    {!same ? <img className="avatar" src={message.author.avatar} /> : null}
    <div>
      {!same ? (
        <div className="d-flex mb-1">
          <div className="mr-2">
            <b>{message.author.name}</b>
          </div>
        </div>
      ) : null}
      <div className={same ? "message-body not-from-me-same" : "message-body"}>
        <div
          className={
            message.attachments.length > 0 ? "text with-attachments" : "text"
          }
        >
          {message.text}
        </div>
        <Attachments attachments={message.attachments} />
      </div>
    </div>
  </div>
);

export default MessageNotFromMe;
