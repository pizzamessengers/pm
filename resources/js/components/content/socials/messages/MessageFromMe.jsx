import React from "react";
import { Link } from "react-router-dom";
import Attachments from "./attachments/Attachments";

const MessageFromMe = ({
  message,
  same,
  fromMessagesWindow,
  fromDialogView
}) => (
  <div className="message d-flex flex-row-reverse float-right justify-content-between">
    <div>
      {!same ? (
        <div className="d-flex justify-content-end mb-1">
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
      <div className="message-body">
        <div className={message.attachments.length > 0 ? "text from-me with-attachments" : "text from-me"}>{message.text}</div>
        <Attachments attachments={message.attachments} />
      </div>
    </div>
  </div>
);

export default MessageFromMe;
