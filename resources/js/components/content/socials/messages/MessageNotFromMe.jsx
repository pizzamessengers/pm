import React from "react";
import Attachments from "./attachments/Attachments";

const MessageNotFromMe = ({ message, same }) => (
  <div className="message d-flex float-left">
    {!same ? <img className="avatar" src={message.author.avatar} /> : null}
    <div>
      {!same ? (
        <div className="authorName">
          <b>{message.author.name}</b>
        </div>
      ) : null}
      <div className={same ? "message-body not-from-me-same" : "message-body"}>
        {message.attachments.length > 0 && message.text.length === 0 ? null : (
          <div
            className={
              message.attachments.length === 1
                ? "text with-attachment"
                : message.attachments.length > 1
                ? "text with-attachments"
                : "text"
            }
          >
            {message.text}
          </div>
        )}
        <Attachments
          attachments={message.attachments}
          withCaption={message.text.length > 0 && message.attachments.length === 1}
        />
      </div>
    </div>
  </div>
);

export default MessageNotFromMe;
