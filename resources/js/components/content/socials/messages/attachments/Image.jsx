import React from "react";

const Image = ({ attachment, withCaption, onLoadAtta }) => (
  <img
    className={!withCaption ? "withoutCaption" : null}
    alt={attachment.url}
    src={attachment.url}
    onLoad={onLoadAtta}
  />
);

export default Image;
