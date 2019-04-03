import React from "react";
import AttachmentDownloading from "./AttachmentDownloading";

const AttachmentList = ({ attachments, remove, mess, handleLoaded, photoUrl, docUrl, videoUrl }) => (
  <ul className="attachment-list">
    {attachments.map((attachment, i) => (
      <AttachmentDownloading
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
