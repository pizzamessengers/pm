import React, { Component, Fragment } from "react";
import translate from "./../../../functions/translate";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Waiting from "./../elements/Waiting";

export default class InstConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      value: 0
    };
    this.loginRef = React.createRef();
    this.passwordRef = React.createRef();
    this.login = null;
    this.password = null;
    this.watching;
  }

  componentDidMount() {
    $(".progress-bar").css("width", "25%");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stage !== prevState.stage) {
      $(".progress-bar").css("width", 25 * (this.state.stage + 1) + "%");
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

  processData = e => {
    e.preventDefault();
    this.login = this.loginRef.current.value;
    this.password = this.passwordRef.current.value;
    this.setState({ stage: 1 });
  };

  connect = () => {
    if (this.watching) {
      this.setState({ stage: 3 });
      if (this.login && this.password) {
        this.props
          .connect(
            "inst",
            {
              login: this.login,
              password: this.password
            },
            this.watching,
            this.state.value
          )
          .then(null, error => this.setState({ stage: 0 }));
      }
    } else alert(translate("connection.error.watching"));
  };

  render() {
    let stages = [
      <Fragment>
        <div className="operation">
          <form
            className="form"
            onSubmit={e => {
              e.preventDefault();
              this.processData(e);
            }}
          >
            <input
              type="text"
              placeholder={translate("all.login")}
              ref={this.loginRef}
              required="required"
            />
            <input
              type="password"
              placeholder={translate("all.pass")}
              ref={this.passwordRef}
              required="required"
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
              <div className="text">{translate("connection.inst.1")}</div>
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
          <button
            className="main-button mt-5"
            onClick={() => {
              this.watching === "all"
                ? this.setState({ stage: 2 })
                : this.connect
            }}
          >
            {translate("all.next")}
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
      <Fragment>
        <div className="operation">
          <div className="w-75">
            <InputRange
              maxValue={20}
              minValue={0}
              value={this.state.value}
              onChange={value => this.setState({ value })}
            />
          </div>
          <button className="main-button mt-5" onClick={this.connect}>
            {translate("connection.all.connect")}
          </button>
        </div>
        <div className="instruction-wrapper">
          <div className="instruction">
            <div className="step">
              <div className="text">
                {translate("connection.all.import.instruction")}
              </div>
            </div>
          </div>
        </div>
      </Fragment>,
      <Waiting />
    ];
    let { stage } = this.state;
    return stages[stage];
  }
}
