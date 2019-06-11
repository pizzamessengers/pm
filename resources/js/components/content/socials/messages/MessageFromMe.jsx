import React from "react";
import Attachments from "./attachments/Attachments";
import Waiting from "./../../elements/Waiting";

const MessageFromMe = ({ message, onLoadAtta }) => (
  <div className="message d-flex flex-row-reverse float-right justify-content-between">
    <div className="message-body d-flex flex-column align-items-end">
      {(message.attachments.length > 0 && message.text.length === 0) ||
      (message.attachments.length === 1 &&
        message.attachments[0].type === "link" &&
        message.text === message.attachments[0].url) ? null : (
        <div
          className={
            message.attachments.length === 1
              ? "text from-me with-attachment"
              : message.attachments.length > 1
              ? "text from-me with-attachments"
              : "text from-me"
          }
        >
          <pre>{message.text}</pre>
        </div>
      )}
      {message.attachments.length > 0 ? (
        message.author === undefined ? (
          <Waiting />
        ) : (
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
        )
      ) : null}
    </div>
  </div>
);

export default MessageFromMe;
