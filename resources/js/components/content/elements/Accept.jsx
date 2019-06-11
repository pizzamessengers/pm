import React from "react";
import { Modal, Button } from "react-bootstrap";

const Accept = ({ show, hide, accept }) => (
  <Modal show={show} onHide={hide}>
    <Modal.Header closeButton>
      <Modal.Title>{translate("all.accept")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Button variant="danger" onClick={accept}>
        {translate("all.next")}
      </Button>
    </Modal.Body>
  </Modal>
);

export default Accept;
