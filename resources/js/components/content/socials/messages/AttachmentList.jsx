import React from "react";
import AttachmentUploading from "./AttachmentUploading";

const AttachmentList = ({ attachments, remove, mess, handleLoaded, photoUrl, docUrl, videoUrl }) => (
  <ul className="attachment-list">
    {attachments.map((attachment, i) => (
      <AttachmentUploading
        key={attachment.lastModified}
        id={i}
        attachment={attachment}
        remove={remove}
        mess={mess}
        handleLoaded={handleLoaded}
        photoUrl={photoUrl}
        docUrl={docUrl}
        videoUrl={videoUrl}
      />
    ))}
  </ul>
);

export default AttachmentList;
