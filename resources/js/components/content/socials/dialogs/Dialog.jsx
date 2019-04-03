import React from "react";
import timestamp from "./../../../../functions/timestamp";

const Dialog = ({ dialog, choosing }) => {
  return (
    <div
      className={
        dialog.unread_count !== 0
          ? "dialog unread " + dialog.mess
          : "dialog " + dialog.mess
      }
    >
      <img className="avatar" src={dialog.photo} />
      <div className="dialog-data">
        <div className="title-text">
          <div className="title">{dialog.name}</div>
          {choosing ? <div>{dialog.members_count}</div> : null}
          <div className="text">{dialog.last_message.text}</div>
          <div className="attachment-exist">
            {dialog.last_message.with_attachments ? "Файл" : null}
          </div>
        </div>
        <div className="timestamp">
          {timestamp(+dialog.last_message.timestamp)}
        </div>
      </div>
      {dialog.unread_count !== 0 ? (
        <div className="unread-count">{dialog.unread_count}</div>
      ) : null}
    </div>
  );
};

export default Dialog;
