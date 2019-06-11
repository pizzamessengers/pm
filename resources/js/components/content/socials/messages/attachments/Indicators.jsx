import React from "react";

const Indicators = ({ attachments, goTo, indicators }) => (
  <ol className="carousel-indicators" ref={indicators}>
    {attachments.map((attachment, i) => (
      <li
        key={i}
        slide={i}
        className={i === 0 ? "active" : null}
        onClick={e => goTo(e)}
      />
    ))}
  </ol>
);

export default Indicators;
