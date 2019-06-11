import React, { Fragment } from "react";
import timestamp from "./../../../../functions/timestamp";

const Dialog = ({ dialog, choosing, withController }) => (
  <div
    className={
      withController
        ? "dialog with-controller"
        : dialog.unread_count !== 0
        ? "dialog unread " + dialog.mess
        : "dialog " + dialog.mess
    }
  >
    <img className="avatar" src={dialog.photo} />
    <div className="dialog-data">
      <div className="title-text">
        <div className="title">{dialog.name}</div>
        {choosing ? <div>{dialog.members_count}</div> : null}
        {withController ? null : (
          <Fragment>
            <div className="text">{dialog.last_message.text}</div>
            <div className="attachment-exist">
              {dialog.last_message.with_attachments
                ? translate("attachments.file")
                : null}
            </div>
          </Fragment>
        )}
      </div>
      {withController ? null : (
        <div className="timestamp">
          {timestamp(+dialog.last_message.timestamp)}
        </div>
      )}
    </div>
    {dialog.unread_count === 0 || withController ? null : (
      <div className="unread-count">{dialog.unread_count}</div>
    )}
  </div>
);

export default Dialog;
