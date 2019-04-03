import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class AttachmentDownloading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    let iw = window.innerWidth;
    this.nameLength = iw < 380 ? 20 : iw > 680 ? 40 : 25;
  }

  componentDidMount() {
    let { attachment, mess, handleLoaded, photoUrl, docUrl, videoUrl, id } = this.props;
    let data = new FormData();
    if (mess === "vk") {
      let type = attachment.type.substr(0, attachment.type.indexOf("/"));
      switch (type) {
        case "image":
          data.append("photo", attachment);
          axios
            .post(photoUrl, data, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(response => {
              this.setState({ loaded: true });
              handleLoaded(response.data, id);
            });
          break;
        case "video":
          data.append("video_file", attachment);
          axios
            .post(videoUrl, data, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(response => {
              this.setState({ loaded: true });
              handleLoaded(response.data, id);
            });
          break;
        case "audio":
          break;
        default:
          data.append("file", attachment);
          axios
            .post(docUrl, data, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then(response => {
              this.setState({ loaded: true });
              handleLoaded(response.data, id);
            });
      }
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
