import React from "react";
import Attachments from "./attachments/Attachments";

const MessageNotFromMe = ({ message, same, onLoadAtta, double }) => (
  <div className="message d-flex float-left">
    {!same && !double ? <img className="avatar" src={message.author.avatar} /> : null}
    <div className="body-author">
      {!same && !double ? (
        <div className="authorName">
          <b>{message.author.name}</b>
        </div>
      ) : null}
      <div className={same && !double ? "message-body not-from-me-same" : "message-body"}>
        {(message.attachments.length > 0 && message.text.length === 0) ||
        (message.text.length === 0 &&
          message.attachments.length === 1 &&
          message.attachments[0].type === "link") ? null : (
          <div
            className={
              message.attachments.length === 1
                ? "text with-attachment"
                : message.attachments.length > 1
                ? "text with-attachments"
                : "text"
            }
          >
            <pre>{message.text}</pre>
          </div>
        )}
        {message.attachments.length > 0 ? (
          <Attachments
            attachments={message.attachments}
            withCaption={
              message.text.length > 0 &&
              message.attachments.length === 1 &&
              message.attachments[0].type !== "link"
            }
            onLoadAtta={onLoadAtta}
            messageId={message.id}
          />
        ) : null}
      </div>
    </div>
  </div>
);

export default MessageNotFromMe;
