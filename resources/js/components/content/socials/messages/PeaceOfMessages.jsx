import React, { Fragment } from "react";

const PeaceOfMessages = ({ messages, isDouble }) => (
  <Fragment>
    <Messages messages={messages} isDouble={isDouble} />
  </Fragment>
);

export default PeaceOfMessages;
