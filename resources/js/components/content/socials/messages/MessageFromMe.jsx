import React from "react";
import Attachments from "./attachments/Attachments";

const MessageFromMe = ({ message }) => (
  <div className="message d-flex flex-row-reverse float-right justify-content-between">
    <div className="message-body d-flex flex-column align-items-end">
      {message.attachments.length > 0 && message.text.length === 0 ? null : (
        <div
          className={
            message.attachments.length === 1
              ? "text from-me with-attachment"
              : message.attachments.length > 1
              ? "text from-me with-attachments"
              : "text from-me"
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
);

export default MessageFromMe;
