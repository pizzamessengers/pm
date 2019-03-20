import React from "react";

const Dialog = ({ dialog }) => {
  let timestamp = () => {
    let rightDecl = count => {
      let num = count % 10;
      if (count === 1) {
        return "у";
      } else if (count > 1 && count <= 4) {
        return "ы";
      } else {
        return "";
      }
    };

    let d = Math.floor(new Date() / 1000),
      startToday = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
      startYest = startToday - 86400,
      diff = d - dialog.last_message.timestamp;

    if (diff < 60) {
      return diff + " " + "секунд" + rightDecl(diff) + " назад";
    } else if (diff < 3600) {
      return diff + " " + "минут" + rightDecl(Math.floor(diff / 60)) + " назад";
    } else if (diff < d - startToday) {
      var options = {
        hour: "numeric",
        minute: "numeric"
      };

      return (
        "сегодня " +
        new Date(dialog.last_message.timestamp).toLocaleString("ru", options)
      );
    } else if (diff < d - startYest) {
      var options = {
        hour: "numeric",
        minute: "numeric"
      };

      return (
        "вчера " +
        new Date(+dialog.last_message.timestamp).toLocaleString("ru", options)
      );
    } else {
      var options = {
        month: "long",
        day: "short",
        hour: "numeric",
        minute: "numeric"
      };

      return new Date(+dialog.last_message.timestamp).toLocaleString(
        "ru",
        options
      );
    }
  };

  console.log(dialog);

  return (
    <div className="dialog">
      <img className="avatar" src={dialog.photo} />
      <div className="dialog-data">
        <div className="title-text">
          <div className="title">{dialog.name}</div>
          <div className="text">{dialog.last_message.text}</div>
        </div>
        <div className="timestamp">{timestamp()}</div>
      </div>
      {dialog.unread_count !== 0 ? <div className="unread-count">{dialog.unread_count}</div> : null}
    </div>
  );
};

export default Dialog;
