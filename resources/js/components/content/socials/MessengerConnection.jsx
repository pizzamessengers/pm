import React from "react";

import VkConnection from "./VkConnection";
import InstConnection from "./InstConnection";
import WappConnection from "./WappConnection";

const MessengerConnection = ({ mess, connect, url }) => {
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

  let messengerNames = {
    vk: 'вконтакте',
    inst: 'инстаграм',
    wapp: 'вотсапп',
  }

  return (
    <div className="d-flex">
      <div className="d-flex flex-column justify-content-center align-items-center col-5">
        Подключение {messengerNames[mess]}
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center col-7">
        {rightComponentForConnection()}
      </div>
    </div>
  );
};

export default MessengerConnection;
