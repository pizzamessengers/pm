import React from "react";
import Image from "./Image";
import Audio from "./Audio";
import Video from "./Video";
import Link from "./Link";

const Attachment = ({ attachment }) => {
  let attachmentType = () => {
    switch (attachment.type) {
      case "image":
        return <Image attachment={attachment} />;
      case "audio":
        return <Audio attachment={attachment} />;
      case "video":
        return <Video attachment={attachment} />;
      case "link":
        return <Link attachment={attachment} />;
    }
  };

  return <div className="attachment">{attachmentType()}</div>;
};

export default Attachment;
