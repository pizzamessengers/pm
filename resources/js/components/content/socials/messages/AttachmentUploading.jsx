import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class AttachmentUploading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    let iw = window.innerWidth;
    this.nameLength = iw < 380 ? 20 : iw > 680 ? 40 : 25;
  }

  componentDidMount() {
    let { attachment, mess, handleLoaded, id } = this.props;
    let type = attachment.type.substr(0, attachment.type.indexOf("/"));
    let result;

    switch (mess) {
      case "vk":
        let data = new FormData();
        let { photoUrl, docUrl, videoUrl } = this.props;
        switch (type) {
          case "image":
            data.append("type", "photo");
            data.append("photo", attachment);
            data.append("url", photoUrl);
            break;
          case "video":
            data.append("type", "video_file");
            data.append("video_file", attachment);
            data.append("url", videoUrl);
            break;
          case "audio":
            break;
          default:
            data.append("type", "file");
            data.append("file", attachment);
            data.append("url", docUrl);
        }

        axios
          .post("api/v1/messages/vkatta?api_token=" + apiToken, data)
          .then(r => {
            this.setState({ loaded: true });
            handleLoaded(r.data.data, id);
          });
        break;
      case "inst":
        if (type === "image" /* || type === "video"*/) {
          handleLoaded(
            {
              type: type,
              path: attachment.path
            },
            id
          );
        } else
          handleLoaded(
            {
              error: "error"
            },
            id
          );

        this.setState({ loaded: true });
        break;
    }
  }

  name = () => {
    let n = this.props.attachment.name;
    let name = n.substr(0, this.nameLength - 5) + "..",
      nl = n.length,
      io = n.indexOf(".", nl - 5);
    name += n.substr(io + 1, nl - io);
    return name;
  };

  render() {
    let { id, attachment, remove } = this.props;

    return (
      <li className="attachment-downloading">
        <div className="progress-name">
          <div className="progress-wrapper">
            <div
              className={
                !this.state.loaded ? "progress loading" : "progress loaded"
              }
            />
          </div>
          <div className="name">
            {attachment.name.length < this.nameLength
              ? attachment.name
              : this.name()}
          </div>
        </div>
        <FontAwesomeIcon
          className="remove"
          icon="times-circle"
          onClick={() => remove(id)}
        />
      </li>
    );
  }
}
