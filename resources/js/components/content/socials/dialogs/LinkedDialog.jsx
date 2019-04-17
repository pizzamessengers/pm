import React from "react";
import { Link } from "react-router-dom";
import Dialog from "./Dialog";

const LinkedDialog = ({ dialog, mess, fromMessagesWindow }) => (
  <Link
    className="linked-dialog d-block"
    to={{
      pathname: "/app/socials/" + mess + "/dialog/" + dialog.id,
      state: { name: dialog.name }
    }}
    onClick={() => {
      if (fromMessagesWindow && window.innerWidth < 992) {
        $(".wrapper").removeClass("showMessagesWindow");
      }
    }}
  >
    <Dialog dialog={dialog} />
  </Link>
);

export default LinkedDialog;
