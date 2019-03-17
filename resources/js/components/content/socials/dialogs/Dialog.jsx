import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Dialog = ({ dialog }) => (
  <Fragment>
    <img
      className="mr-4"
      src={dialog.photo}
      width={50 + "px"}
      height={50 + "px"}
    />
    <div>
      {dialog.name}
      <br />
      Участников: {dialog.members_count}
      <br />
      {dialog.last_message.text}
    </div>
  </Fragment>
);

export default Dialog;
