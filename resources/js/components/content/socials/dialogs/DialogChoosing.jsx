import React from "react";
import { Modal, Button } from "react-bootstrap";
import translate from "./../../../../functions/translate";
import Dialog from "./Dialog";

const DialogChoosing = ({ handleAccept, one, dialogs, hide, title, mess }) => {
  let accept = () => {
    let dialogList = [];
    $('input[name="dialog"]:checked').each(function() {
      dialogList.push(dialogs[$(this).val()]);
    });

    let data = {
      mess: mess,
      dialogs: dialogList
    };
    axios.post("api/v1/dialogs?api_token=" + apiToken, data).then(response => {
      if (!response.data.success) {
        alert(translate(response.data.message));
      } else handleAccept();
      hide();
    });
  };

  return (
    <Modal show={true} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {dialogs.map((dialog, i) => (
          <label key={i} className="d-flex align-items-center">
            <input
              className="mr-2"
              type={one ? "radio" : "checkbox"}
              value={i}
              name="dialog"
            />
            <Dialog dialog={dialog} choosing />
          </label>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={accept}>
          {translate("all.next")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DialogChoosing;
