import React, { Fragment } from "react";
import translate from "./../../../../../functions/translate";

const Video = ({ attachment }) => (
  <Fragment key={attachment.url}>
    {attachment.url === "https://vk.com/images/camera_100.png" ? (
      <div>{translate("attachments.deleted-video")}</div>
    ) : null}
    <iframe src={attachment.url} width="100%" frameBorder="0" allowFullScreen />
  </Fragment>
);

export default Video;
