import React, { Component } from "react";
import Image from "./Image";
import Audio from "./Audio";
import Video from "./Video";
import Link from "./Link";
import Document from "./Document";

export default class Attachment extends Component {
  constructor(props) {
    super(props);
    this.attachment = React.createRef();
  }

  attachmentType = () => {
    let { attachment, withCaption, onLoadAtta } = this.props;
    switch (attachment.type) {
      case "image":
        return (
          <Image
            attachment={attachment}
            withCaption={withCaption}
            onLoadAtta={onLoadAtta}
          />
        );
      case "audio":
        return <Audio attachment={attachment} />;
      case "video":
        return <Video attachment={attachment} />;
      case "link":
        return <Link attachment={attachment} />;
      case "doc":
        return <Document attachment={attachment} />;
    }
  };

  render() {
    return (
      <div className="attachment" ref={this.attachment}>
        {this.attachmentType()}
      </div>
    );
  }
}
