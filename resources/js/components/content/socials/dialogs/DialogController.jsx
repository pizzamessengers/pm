import React, { Fragment } from "react";
import LinkedDialog from "./LinkedDialog";

const DialogController = ({ dialog, mess, toggleUpdating, deleteDialog }) => {
  return (
    <Fragment>
      <LinkedDialog dialog={dialog} mess={mess} />
      <input
        checked={dialog.updating}
        className="col-1"
        type="checkbox"
        onChange={() => toggleUpdating(dialog)}
      />
      <button
        className="btn btn-delete col-3"
        onClick={() => deleteDialog(dialog)}
      >
        удалить
      </button>
    </Fragment>
  );
};

export default DialogController;
