import React from "react";
import { Link } from "react-router-dom";
import Dialog from "./Dialog";

const LinkedDialog = ({ dialog, mess }) => (
  <Link
    className="nav-link d-flex col-8"
    to={{
      pathname: "/app/socials/" + mess + "/dialog/" + dialog.id,
      state: { name: dialog.name }
    }}
  >
    <Dialog dialog={dialog} />
  </Link>
);

export default LinkedDialog;
