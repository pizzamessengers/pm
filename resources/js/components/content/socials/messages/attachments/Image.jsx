import React from "react";

const Image = ({ attachment, withCaption }) => (
  <img
    className={!withCaption ? "withoutCaption" : null}
    alt={attachment.url}
    src={attachment.url}
  />
);

export default Image;
