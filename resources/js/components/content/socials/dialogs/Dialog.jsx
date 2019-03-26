import React from "react";

const Dialog = ({ dialog, choosing }) => {
  let timestamp = () => {
    let rightDecl = count => {
      let num = count % 10;
      if (num === 1) {
        return "у";
      } else if (num > 1 && num <= 4) {
        return "ы";
      } else {
        return "";
      }
    };

    let d = new Date(),
      lmt = +dialog.last_message.timestamp,
      startToday = new Date().setHours(0, 0, 0, 0),
      startYest = startToday - 86400000,
      diff = d - lmt;

    if (diff < 60000) {
      let count = Math.floor(diff / 1000);
      return count + " " + "секунд" + rightDecl(count) + " назад";
    } else if (diff < 3600000) {
      let count = Math.floor(diff / 60000);
      return count + " " + "минут" + rightDecl(count) + " назад";
    } else if (diff < d - startToday) {
      var options = {
        timezone: 'UTC+1',
        hour: "numeric",
        minute: "numeric"
      };

      return "сегодня, " + new Date(lmt).toLocaleString("ru", options);
    } else if (diff < d - startYest) {
      var options = {
        timezone: 'UTC',
        hour: "numeric",
        minute: "numeric"
      };

      return "вчера, " + new Date(lmt).toLocaleString("ru", options);
    } else {
      var options = {
        timezone: 'UTC',
        month: "long",
        day: "2-digit"
      };

      return new Date(lmt).toLocaleString("ru", options);
    }
  };

  return (
    <div className={dialog.unread_count !== 0 ? "dialog unread "+dialog.mess : "dialog "+dialog.mess}>
      <img className="avatar" src={dialog.photo} />
      <div className="dialog-data">
        <div className="title-text">
          <div className="title">{dialog.name}</div>
          {choosing ? <div>{dialog.members_count}</div> : null}
          <div className="text">{dialog.last_message.text}</div>
        </div>
        <div className="timestamp">{timestamp()}</div>
      </div>
      {dialog.unread_count !== 0 ? (
        <div className="unread-count">{dialog.unread_count}</div>
      ) : null}
    </div>
  );
};

export default Dialog;
