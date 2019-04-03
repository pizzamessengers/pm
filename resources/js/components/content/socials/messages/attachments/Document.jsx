import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Document = ({ attachment }) => (
  <div className="doc">
    <a href={attachment.url}>
      <FontAwesomeIcon className="doc-icon" icon="download" />
    </a>
    <a href={attachment.url} className="doc-name">
      {attachment.name}
    </a>
  </div>
);

export default Document;
