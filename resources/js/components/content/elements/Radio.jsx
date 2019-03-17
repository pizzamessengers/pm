import React, { Fragment } from "react";

const Radio = ({ checked, handleChange, name }) => (
  <Fragment>
    <label htmlFor={name} className={checked ? "on chkbox" : "chkbox"}>
      <span className="pip" />
    </label>
    <input
      type="radio"
      onChange={e => {
        handleChange(e);
      }}
      checked={checked}
      id={name}
      name={name}
    />
  </Fragment>
);

export default Radio;
