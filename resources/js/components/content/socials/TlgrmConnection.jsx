import React, { Component, Fragment } from "react";
import translate from "./../../../functions/translate";
import Waiting from "./../elements/Waiting";

export default class TlgrmConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    };
    this.token = React.createRef();
    this.stages = [
      <Fragment>
        <div className="operation">
          <form
            className="form"
            onSubmit={e => {
              e.preventDefault();
              this.connect();
            }}
          >
            <input
              type="text"
              placeholder={translate("all.token")}
              ref={this.token}
              required
            />
            <input
              type="submit"
              className="main-button"
              value={translate("connection.all.connect")}
            />
          </form>
        </div>
        <div className="instruction-wrapper">
          <div className="instruction">
            <div className="step">
              <div className="text">{translate("connection.wapp.1")}</div>
            </div>
          </div>
        </div>
      </Fragment>,
      <Waiting />
    ];
  }

  componentDidMount() {
    $(".progress-bar").css("width", "50%");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stage !== prevState.stage) {
      $(".progress-bar").css(
        "width",
        50 * (this.state.stage + 1) + "%"
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

  connect = () => {
      if (this.token.current.value) {
        this.props
          .connect(
            "tlgrm",
            {
              token: this.token.current.value
            },
            'all'
          )
          .then(null, error => this.setState({ stage: 0 }));
      }
      this.setState({ stage: 1 });
  };

  render() {
    let { stage } = this.state;
    return this.stages[stage];
  }
}
