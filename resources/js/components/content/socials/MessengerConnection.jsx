import React from "react";

import VkConnection from "./VkConnection";
import InstConnection from "./InstConnection";
import WappConnection from "./WappConnection";

const MessengerConnection = ({ mess, connect }) => {
  let rightComponentForConnection = () => {
    switch (mess) {
      case "vk":
        return <VkConnection connect={connect} />;
      case "inst":
        return <InstConnection connect={connect} />;
      case "wapp":
        return <WappConnection connect={connect} />;
    }
  };

  return (
    <div className="messenger-connection">
      <div className="title">Подключение</div>
      <div className="progress-wrapper">
        <div className="progress">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
          />
        </div>
      </div>
      <div className="connection">{rightComponentForConnection()}</div>
    </div>
  );
};

export default MessengerConnection;
