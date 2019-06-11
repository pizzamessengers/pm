import React from "react";

const VkRefresh = ({ connectDialogs, waitingOn }) => {
  let vkRefresh = () => {
    waitingOn();
    console.log('here');
    axios.get("api/v1/dialogs/vk?api_token=" + apiToken).then(response => {
      if (response.data.success) {
        connectDialogs(response.data.dialogs);
      }
    });
  };

  return (
    <div className="w-100 d-flex justify-content-center">
      <button className="main-button" onClick={vkRefresh}>
        {translate("connection.vk.refresh")}
      </button>
    </div>
  );
};

export default VkRefresh;
