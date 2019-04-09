import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import translate from "./../../../../functions/translate";
import AttachmentList from "./AttachmentList";

export default class SendMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: []
    };
    this.text = React.createRef();
    this.files = React.createRef();

    switch (this.props.mess) {
      case "vk":
        this.attachments = {
          photos: [],
          servers: [],
          hashes: [],
          docs: [],
          videos: []
        };
        //urls for attachments
        axios
          .get(
            "https://api.vk.com/method/execute.getAttaUrls?peer_id=" +
              this.props.dialogId +
              "&access_token=" +
              socials[this.props.mess].token +
              "&v=5.92"
          )
          .then(response => {
            let r = response.data.response;
            this.photoUrl = r.photoUrl;
            this.docUrl = r.docUrl;
            this.videoUrl = r.videoUrl;
            this.owner_id = r.owner_id;
            this.attachments.videos.push(r.owner_id);
          });
        break;
      case "inst":
        this.attachments = [];
    }
  }

  componentDidMount() {
    this.trimSMW();

    $(this.text.current).keypress(e => {
      if ((e.keyCode == 13 || e.keyCode == 10) && e.ctrlKey) {
        $(this.text.current).val((i, val) => {
          return val + "\n";
        });
        this.handleChangeText();
      } else if (e.keyCode === 13 && !e.ctrlKey) {
        this.sendMessage(e);
      }
    });
  }

  trimSMW = () => {
    $(".send-message-wrapper")
      .css("height", "0")
      .css("height", (this.text.current.scrollHeight * 5) / 4 + 0.65 + "px");
  };

  trimALW = al => {
    $(".attachment-list-wrapper").css("height", al * 21 + 5 + "px");
  };

  trimList = () => {
    $(".card-body .list-wrapper").css(
      "height",
      "calc(100% - " + ($(".card-footer").height() + 1) + "px)"
    );
  };

  trimFooter = () => {
    $(".card-footer").css(
      "height",
      $(".send-message-wrapper").height() +
        $(".attachment-list-wrapper").height() +
        1 +
        "px"
    );
  };

  handleChangeText = () => {
    this.trimSMW();
    this.trimFooter();
    this.trimList();

    if (this.text.current.value.length > 0) {
      this.showSendButton();
    } else this.hideSendButton();
  };

  handleChangeFiles = () => {
    let { files } = this.files.current;
    this.saveFiles(files);
  };

  removeAtta = i => {
    let { attachments } = this.state;
    if (attachments.length === 1) this.hideSendButton();
    attachments.splice(i, 1);
    this.setState({ attachments });
    this.trimALW(attachments.length);
    this.trimFooter();
    this.trimList();
  };

  saveFiles = files => {
    let { attachments } = this.state,
      exist,
      type;

    for (let i = 0; i < files.length; i++) {
      exist = attachments.some(attachment => {
        if (
          attachment.name === files[i].name &&
          attachment.lastModified === files[i].lastModified
        ) {
          return true;
        }
      });

      if (!exist) {
        attachments.push(files[i]);

        this.trimALW(attachments.length);
        this.trimFooter();
        this.trimList();
      }
    }
    this.setState({ attachments });
    this.files.current.value = "";
  };

  handleLoaded = (data, i) => {
    if (!data.error) {
      this.showSendButton();

      switch (this.props.mess) {
        case "vk":
          if (data.photo) {
            this.attachments.photos.push(data.photo);
            this.attachments.servers.push(data.server);
            this.attachments.hashes.push(data.hash);
          } else if (data.video_id) {
            this.attachments.videos.push(data.video_id);
          } else if (data.file) {
            this.attachments.docs.push(data.file);
          }
          break;
        case "inst":
          this.attachments.push(data);
          break;
      }
    } else {
      this.removeAtta(i);
      alert(translate("attachments.error.invalid-type"));
    }
  };

  showSendButton = () => {
    $(".send-message button").addClass("allow-send");
  };

  hideSendButton = () => {
    $(".send-message button").removeClass("allow-send");
  };

  sendMessage = e => {
    e.preventDefault();
    let { addMessage, mess, dialogId } = this.props;
    let { attachments } = this.state;
    let text = this.text.current.value;

    if (text !== "" || attachments.length !== 0) {
      addMessage(text, attachments);

      let data = {
        mess: mess,
        dialogId: dialogId,
        text: text,
        attachments: this.attachments
      };
      axios.post("api/v1/messages/send?api_token=" + apiToken, data);

      this.refresh();
    }
  };

  refresh = () => {
    this.text.current.value = "";
    switch (this.props.mess) {
      case "vk":
        this.attachments = {
          photos: [],
          servers: [],
          hashes: [],
          docs: [],
          videos: [this.owner_id]
        };
        break;
      case "inst":
      case "wapp":
        this.attachments = [];
        break;
    }

    this.hideSendButton();
    this.setState({ attachments: [] }, () => {
      this.trimALW(0);
      this.trimSMW();
      this.trimFooter();
      this.trimList();
    });
  };

  acceptions = () => {
    switch (this.props.mess) {
      case "vk":
        return "image/*, video/*, text/*";
      case "inst":
        return "image/jpeg"; // TODO: , video/*
    }
  };

  render() {
    return (
      <Fragment>
        <div className="send-message-wrapper">
          <form className="send-message" onSubmit={e => this.sendMessage(e)}>
            <input
              ref={this.files}
              multiple
              type="file"
              accept={this.acceptions()}
              id="file"
              className="d-none"
              onChange={this.handleChangeFiles}
            />
            <label htmlFor="file">
              <FontAwesomeIcon
                className="icon"
                icon={["fas", "share-square"]}
              />
            </label>
            <textarea
              ref={this.text}
              placeholder={translate("message.text")}
              onChange={this.handleChangeText}
            />
            <button type="submit">
              <FontAwesomeIcon className="icon" icon={["fas", "arrow-right"]} />
            </button>
          </form>
        </div>
        <div className="attachment-list-wrapper">
          <AttachmentList
            attachments={this.state.attachments}
            remove={this.removeAtta}
            mess={this.props.mess}
            handleLoaded={this.handleLoaded}
            photoUrl={this.photoUrl}
            docUrl={this.docUrl}
            videoUrl={this.videoUrl}
          />
        </div>
      </Fragment>
    );
  }
}
