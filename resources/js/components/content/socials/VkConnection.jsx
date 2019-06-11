import React, { Component, Fragment } from "react";
import Waiting from "./../elements/Waiting";

export default class VkConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: window.location.search ? 2 : 0
    };

    this.urlInput = React.createRef();
    this.stages = [
      <Fragment>
        <div className="operation">
          <a
            className="main-button"
            onClick={() => this.setState({ stage: 1 })}
            href={
              "https://oauth.vk.com/authorize?client_id=6995405&display=popup&redirect_uri=" +
              window.location.href +
              "&scope=groups,video,photos,docs,offline&response_type=code&v=5.92"
            }
          >
            {translate("connection.all.connect")}
          </a>
        </div>
        <div className="instruction-wrapper">
          <div className="instruction">
            <div className="step">
              <div className="text">{translate("connection.vk.1")}</div>
            </div>
          </div>
        </div>
      </Fragment>,
      /*<Fragment>
        <div className="operation">
          <form
            className="form"
            onSubmit={e => {
              e.preventDefault();
              this.processUrlInput();
            }}
          >
            <input
              type="text"
              placeholder={translate("all.url")}
              ref={this.urlInput}
              required
            />
            <input
              type="submit"
              className="main-button"
              value={translate("all.next")}
            />
          </form>
        </div>
        <div className="instruction-wrapper">
          <div className="instruction">
            <div className="step">
              <div className="text">{translate("connection.vk.2.1")}</div>
              <img
                src={
                  window.location.origin +
                  "/storage/connectionInstructions/vk_2_1.png"
                }
              />
            </div>
            <div className="step">
              <div className="text">{translate("connection.vk.2.2")}</div>
              <img
                src={
                  window.location.origin +
                  "/storage/connectionInstructions/vk_2_2.png"
                }
              />
            </div>
          </div>
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <div className="d-flex">
            <div
              className="watching-choosing"
              watching="all"
              onMouseOver={e => this.mouseOverHandler(e)}
              onMouseOut={this.mouseOutHandler}
              onClick={e => this.clickHandler(e)}
            >
              {translate("messenger.watching.all")}
            </div>
            <div
              className="watching-choosing"
              watching="dialogs"
              onMouseOver={e => this.mouseOverHandler(e)}
              onMouseOut={this.mouseOutHandler}
              onClick={e => this.clickHandler(e)}
            >
              {translate("messenger.watching.dialogs")}
            </div>
          </div>
          <button className="main-button mt-5" onClick={this.connect}>
            {translate("connection.all.connect")}
          </button>
        </div>
        <div className="instruction-wrapper">
          <div className="instruction">
            <div className="step">
              <div className="text">
                {translate("connection.all.watching.choosing")}
              </div>
            </div>
          </div>
        </div>
      </Fragment>,*/
      <Waiting />,
      <Fragment>
        <Waiting />
        {this.connect()}
      </Fragment>
    ];

    this.watching;
  }

  componentDidMount() {
    $(".progress-bar").css("width", "50%");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stage !== prevState.stage) {
      $(".progress-bar").css("width", 50 * (this.state.stage + 1) + "%");
    }
  }

  connect = () => {
    if (window.location.search) {
      let code = window.location.search.split("=")[1];
      this.props
        .connect("vk", { code: code }, "dialogs")
        .then(null, error => this.setState({ stage: 0 }));
    }
  };

  /*instructionText = watching => {
    switch (watching) {
      case "all":
        $(".instruction .text").html(translate("connection.all.watching.all"));
        break;
      case "dialogs":
        $(".instruction .text").html(
          translate("connection.all.watching.dialogs")
        );
        break;
    }
  };

  mouseOverHandler = e => {
    if ($(e.target).attr("watching") !== this.watching) {
      this.instructionText($(e.target).attr("watching"));
      $(e.target).addClass("hovered");
    }
  };

  mouseOutHandler = e => {
    if (!this.watching)
      $(".instruction .text").html(
        translate("connection.all.watching.choosing")
      );
    else this.instructionText(this.watching);
    $(e.target).removeClass("hovered");
  };

  clickHandler = e => {
    $(".active").removeClass("active");
    $(e.target).addClass("active");
    this.watching = $(e.target).attr("watching");
    this.instructionText($(e.target).attr("watching"));
  };

  processUrlInput = () => {
    let url = this.urlInput.current.value;
    if (url.substr(0, 8) !== "https://") {
      $(this.urlInput.current).addClass("invalid");
      alert(translate("messenger.error.incorrect-vk-url"));
      this.urlInput.current.value = "";
    } else {
      let token = url.substring(45, url.indexOf("&", 45));
      axios
        .get(
          "https://api.vk.com/method/execute.isAppUser?access_token=" +
            token +
            "&v=5.92"
        )
        .then(response => {
          if (response.data.response) {
            this.setState({ stage: 2 });
            this.token = token;
          } else {
            $(this.urlInput.current).addClass("invalid");
            alert(translate("messenger.error.incorrect-vk-url"));
            this.urlInput.current.value = "";
          }
        });
    }
  };*/

  render() {
    let { stage } = this.state;
    return this.stages[stage];
  }
}
