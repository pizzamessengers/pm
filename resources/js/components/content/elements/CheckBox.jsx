import React, { Fragment } from "react";

const CheckBox = ({ checked, handleChange, name, withOn }) => (
  <Fragment>
    <label htmlFor={name} className={checked ? withOn ? "on chkbox with-on" : "on chkbox" :  withOn ? "with-on chkbox" : "chkbox"}>
      <span className="toggle" />
    </label>
    <input
      type="checkbox"
      onChange={e => {
        handleChange(e);
      }}
      checked={checked}
      id={name}
      name={name}
    />
  </Fragment>
);

export default CheckBox;
