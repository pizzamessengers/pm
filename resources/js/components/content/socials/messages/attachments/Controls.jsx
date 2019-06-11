import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Controls = ({ prev, next }) => (
  <Fragment>
    <a className="carousel-control-prev" role="button" onClick={this.prev}>
      <FontAwesomeIcon
        className="carousel-control-prev-icon"
        icon="chevron-left"
      />
      <span className="sr-only">Previous</span>
    </a>
    <a className="carousel-control-next" role="button" onClick={this.next}>
      <FontAwesomeIcon
        className="carousel-control-next-icon"
        icon="chevron-right"
      />
      <span className="sr-only">Next</span>
    </a>
  </Fragment>
);

export default Controls;
