import React, { Component } from "react";
import Swipe from "react-easy-swipe";
import Attachment from "./Attachment";
import AttachmentList from "./AttachmentList";
import Indicators from "./Indicators";
import Controls from "./Controls";

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
      <Swipe className="w-100" onSwipeLeft={this.next} onSwipeRight={this.prev}>
        <div className="attachments my-carousel" ref={this.carousel}>
          {/*<div className="counter">
          {currentSlide + 1}/{attachments.length}
        </div>*/}
          <Indicators
            attachments={attachments}
            goTo={this.goTo}
            indicators={this.indicators}
          />
          <AttachmentList
            attachments={attachments}
            carouselInner={this.carouselInner}
            withCaption={withCaption}
            onLoadAtta={this.onLoadAtta}
          />
          <Controls prev={this.prev} next={this.next} />
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
