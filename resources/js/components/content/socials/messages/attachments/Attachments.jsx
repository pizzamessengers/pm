import React from "react";
import Attachment from "./Attachment";

const Attachments = ({ attachments }) =>
  attachments.map((attachment, i) => (
    <Attachment key={i} attachment={attachment} />
  ));

export default Attachments;
