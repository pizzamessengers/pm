import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Audio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      timing: 0,
      mouseTiming: null
    };
    this.player = React.createRef();
    this.timingDisplayValue = React.createRef();
    this.duration = 0;
    this.interval;
  }

  loaded = () => {
    this.duration = this.player.current.duration;
  };

  ended = () => {
    this.setState({ playing: false, timing: 0 });
    clearInterval(this.interval);
  };

  togglePlaying = () => {
    let { playing } = this.state;
    if (playing) {
      this.player.current.pause();
      this.setState({ playing: !playing });
      clearInterval(this.interval);
    } else {
      this.player.current.play();
      this.setState({ playing: !playing });
      this.interval = setInterval(() => {
        this.setState({ timing: this.state.timing + 0.5 });
      }, 500);
    }
  };

  checkTiming = e => {
    let x =
      e.nativeEvent.offsetX == undefined
        ? e.nativeEvent.layerX
        : e.nativeEvent.offsetX;
    let el = $(e.target).hasClass("progress")
      ? $(e.target)
      : $(e.target).parent();
    return (x / el.width()) * this.duration;
  };

  goTo = e => {
    let timing = this.checkTiming(e);
    this.player.current.currentTime = timing;
    this.setState({ timing });
  };

  movingMouse = e => {
    if (
      !$(e.target).hasClass("progress") &&
      !$(e.target).hasClass("progress-bar")
    )
      return;
    let mouseTiming = this.checkTiming(e);
    $(this.timingDisplayValue.current).css(
      "left",
      (mouseTiming * 100) / this.duration + "%"
    );
    this.setState({ mouseTiming });
  };

  timingDisplayOff = () => {
    this.setState({ mouseTiming: null });
  };

  displayTiming = mouseTiming => {
    let minutes = Math.floor(mouseTiming / 60);
    let seconds = Math.round(mouseTiming % 60);
    let timing =
      seconds >= 10 ? minutes + ":" + seconds : minutes + ":0" + seconds;
    return timing;
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { attachment } = this.props;
    let { playing, timing, mouseTiming } = this.state;

    return (
      <div className="player">
        <div>{attachment.name}</div>
        <audio
          ref={this.player}
          src={attachment.url}
          onCanPlayThrough={this.loaded}
          onEnded={this.ended}
        />
        <div className="controls">
          <button className="control play-pause" onClick={this.togglePlaying}>
            <FontAwesomeIcon
              className="doc-icon"
              icon={playing ? "pause" : "play"}
            />
          </button>
          <div
            className="progress"
            onMouseMove={this.movingMouse}
            onMouseOut={this.timingDisplayOff}
            onClick={this.goTo}
          >
            <div
              className={mouseTiming === null ? "d-none" : "timing"}
              ref={this.timingDisplayValue}
            >
              {this.displayTiming(mouseTiming)}
            </div>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: (100 / this.duration) * timing + "%" }}
              role="progressbar"
            />
          </div>
        </div>
      </div>
    );
  }
}
