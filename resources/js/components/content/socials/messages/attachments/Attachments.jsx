import React, { Component } from "react";
import Swipe from "react-easy-swipe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Attachment from "./Attachment";

export default class Attachments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0
    };
    this.carousel = React.createRef();
    this.indicators = React.createRef();
    this.carouselInner = React.createRef();
  }

  prev = () => {
    let { currentSlide } = this.state;

    if (currentSlide > 0) {
      let active = $(this.indicators.current).children(".active");
      active.removeClass("active");
      setTimeout(() => {
        active.prev().addClass("active");
      }, 500);

      currentSlide -= 1;
      this.translateInner(currentSlide);
    }
  };

  next = () => {
    let { currentSlide } = this.state;

    if (currentSlide < this.props.attachments.length - 1) {
      let active = $(this.indicators.current).children(".active");
      active.removeClass("active");
      setTimeout(() => {
        active.next().addClass("active");
      }, 500);

      currentSlide += 1;
      this.translateInner(currentSlide);
    }
  };

  goTo = e => {
    let indicator = $(e.target);
    $(this.indicators.current)
      .children(".active")
      .removeClass("active");
    setTimeout(() => {
      indicator.addClass("active");
    }, 500);

    this.translateInner(indicator.attr("slide"));
  };

  translateInner = slide => {
    $(this.carouselInner.current).css(
      "transform",
      "translateX(-" + $(this.carousel.current).width() * slide + "px)"
    );
    this.setState({ currentSlide: slide });
  };

  render() {
    let { attachments, withCaption, onLoadAtta, messageId } = this.props;
    let { currentSlide } = this.state;
    return attachments.length > 1 ? (
      <Swipe onSwipeLeft={this.next} onSwipeRight={this.prev}>
        <div className="attachments my-carousel" ref={this.carousel}>
          {/*<div className="counter">
          {currentSlide + 1}/{attachments.length}
        </div>*/}
          <ol className="carousel-indicators" ref={this.indicators}>
            {attachments.map((attachment, i) => (
              <li
                key={i}
                slide={i}
                className={i === 0 ? "active" : null}
                onClick={e => this.goTo(e)}
              />
            ))}
          </ol>
          <div className="my-carousel-inner" ref={this.carouselInner}>
            {attachments.map((attachment, i) => (
              <div
                key={i}
                className={
                  i === 0 ? "my-carousel-item active" : "my-carousel-item"
                }
              >
                <Attachment
                  attachment={attachment}
                  withCaption={withCaption}
                  onLoadAtta={this.onLoadAtta}
                />
              </div>
            ))}
          </div>
          <a
            className="carousel-control-prev"
            role="button"
            onClick={this.prev}
          >
            <FontAwesomeIcon
              className="carousel-control-prev-icon"
              icon="chevron-left"
            />
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            role="button"
            onClick={this.next}
          >
            <FontAwesomeIcon
              className="carousel-control-next-icon"
              icon="chevron-right"
            />
            <span className="sr-only">Next</span>
          </a>
        </div>
      </Swipe>
    ) : (
      <div className="attachments">
        <Attachment
          attachment={attachments[0]}
          withCaption={withCaption}
          onLoadAtta={onLoadAtta}
        />
      </div>
    );
  }
}
