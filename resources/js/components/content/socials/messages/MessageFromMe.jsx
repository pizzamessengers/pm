import React from "react";
import Attachments from "./attachments/Attachments";

const MessageFromMe = ({ message, same }) => (
  <div className="message d-flex flex-row-reverse float-right justify-content-between">
    <div>
      <div className="message-body">
        <div
          className={
            message.attachments.length > 0
              ? "text from-me with-attachments"
              : "text from-me"
          }
        >
          {message.text}
        </div>
        <Attachments attachments={message.attachments} />
      </div>
    </div>
  </div>
);

export default MessageFromMe;
