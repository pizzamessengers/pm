import React, { Component, Fragment } from "react";
import Waiting from "./../elements/Waiting";

export default class WappConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    };
    this.tokenRef = React.createRef();
    this.urlRef = React.createRef();
    this.stages = [
      <Fragment>
        <div className="operation">
          <a
            target="_blank"
            className="main-button"
            href="https://app.chat-api.com"
            onClick={() => this.setState({ stage: 1 })}
          >
            {translate("connection.all.get-token")}
          </a>
        </div>
        <div className="instruction-wrapper">
          <div className="instruction">
            <div className="step">
              <div className="text">{translate("connection.wapp.1")}</div>
            </div>
          </div>
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <form className="form" onSubmit={e => this.installWapp(e)}>
            <input type="text" placeholder="Api URL" ref={this.urlRef} />
            <input
              type="text"
              placeholder={translate("all.token")}
              ref={this.tokenRef}
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
              <div className="text">{translate("connection.wapp.2.1")}</div>
            </div>
            <div className="step">
              <div className="text">{translate("connection.wapp.2.2")}</div>
              <img
                src={
                  window.location.origin +
                  "/storage/connectionInstructions/wapp_2_2.png"
                }
              />
            </div>
            <div className="step">
              <div className="text">{translate("connection.wapp.2.3")}</div>
              <img
                src={
                  window.location.origin +
                  "/storage/connectionInstructions/wapp_2_3.png"
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
      </Fragment>,
      <Waiting />
    ];

    this.token = null;
    this.url = null;
    this.qr = null;
    this.watching;
  }

  componentDidMount() {
    $(".progress-bar").css("width", "25%");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stage !== prevState.stage) {
      $(".progress-bar").css(
        "width",
        (100 / this.stages.length) * (this.state.stage + 1) + "%"
      );
    }
  }

  instructionText = watching => {
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

  installWapp = e => {
    e.preventDefault();
    this.token = this.tokenRef.current.value;
    this.url = this.urlRef.current.value;
    let url = this.url + "status?token=" + this.token;
    axios
      .get(
        "api/v1/messengers/wapp/status?url=" + url + "&api_token=" + apiToken
      )
      .then(response => {
        switch (response.data.status) {
          case "got qr code":
            alert(translate("messenger.error.qr"));
            break;
          case "loading":
            this.installWapp();
            break;
          case "authenticated":
            this.setState({ stage: 2 });
            break;
        }
      });
  };

  connect = () => {
    if (this.watching) {
      this.setState({ stage: 3 });
      if (this.token && this.url) {
        this.props
          .connect(
            "wapp",
            {
              url: this.url,
              token: this.token
            },
            this.watching
          )
          .then(null, error => this.setState({ stage: 0 }));
      }
    } else alert(translate("connection.error.watching"));
  };

  render() {
    let { stage } = this.state;
    return this.stages[stage];
  }
}
