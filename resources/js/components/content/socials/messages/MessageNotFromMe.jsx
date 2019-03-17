import React from "react";
import { Link } from "react-router-dom";
import Attachments from "./attachments/Attachments";

const MessageNotFromMe = ({
  message,
  same,
  fromMessagesWindow,
  fromDialogView
}) => (
  <div className="message d-flex float-left">
    {!same ? (
      <img
        className="avatar"
        src={message.author.avatar}
      />
    ) : null}
    <div>
      {!same ? (
        <div className="d-flex mb-1">
          <div className="mr-2"><b>{message.author.name}</b></div>
          {!fromDialogView ? (
            <Link
              to={
                "/app/socials/" + message.mess + "/dialog/" + message.dialog.id
              }
              onClick={() => {
                if (fromMessagesWindow && window.innerWidth < 992) {
                  $(".wrapper").removeClass("showMessagesWindow");
                }
              }}
            >
              <div>{message.dialog.name}</div>
            </Link>
          ) : null}
        </div>
      ) : null}
      <div className={same ? "message-body not-from-me-same" : "message-body"}>
        <div className={message.attachments.length > 0 ? "text with-attachments" : "text"}>{message.text}</div>
        <Attachments attachments={message.attachments} />
      </div>
    </div>
  </div>
);

export default MessageNotFromMe;
