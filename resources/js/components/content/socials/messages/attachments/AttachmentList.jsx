import React from "react";
import Attachment from "./Attachment";

const AttachmentList = ({
  attachments,
  carouselInner,
  withCaption,
  onLoadAtta
}) => (
  <div className="my-carousel-inner" ref={carouselInner}>
    {attachments.map((attachment, i) => (
      <div
        key={i}
        className={i === 0 ? "my-carousel-item active" : "my-carousel-item"}
      >
        <Attachment
          attachment={attachment}
          withCaption={withCaption}
          onLoadAtta={onLoadAtta}
        />
      </div>
    ))}
  </div>
);

export default AttachmentList;
