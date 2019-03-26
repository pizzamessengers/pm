import React from "react";
import Attachment from "./Attachment";

const Attachments = ({ attachments, withCaption }) => (
  <div className="attachments d-flex">
    {attachments.map((attachment, i) => (
      <Attachment key={i} attachment={attachment} withCaption={withCaption} />
    ))}
  </div>
);

export default Attachments;
