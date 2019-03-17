import React, { Fragment } from "react";

const Audio = ({ attachment }) => (
  <Fragment>
    <div>{attachment.name}</div>
    <audio controls src={attachment.url} />
  </Fragment>
);

export default Audio;
