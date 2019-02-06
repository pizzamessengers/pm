import React, { Component, Fragment } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default class Dialogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        show: false,
        dialogs: null
      }
    };
    this.dialogId;
    this.dialogName;
    this.req = React.createRef();
  }

  createDialog = e => {
    e.preventDefault();
    let data = {
      mess: this.props.mess,
      req: this.req.current.value
    };
    axios.post("api/v1/dialogs?api_token=" + apiToken, data).then(response => {
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        if (response.data.needChoose) {
          this.setState({
            modal: {
              show: true,
              dialogs: response.data.dialogs
            }
          });
        } else {
          socials[this.props.mess].dialogList.push({
            id: response.data.dialog.id,
            name: response.data.dialog.name,
            updating: true
          });
        }
        this.forceUpdate();
      }
    });
  };

  deleteDialog = dialog => {
    axios.delete("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken);
    socials[this.props.mess].dialogList.splice(
      socials[this.props.mess].dialogList.map(x => x.id).indexOf(dialog.id),
      1
    );
    this.forceUpdate();
  };

  toggleUpdating = (e, dialog) => {
    dialog.updating = e.target.checked;
    this.forceUpdate();
    axios.put("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken);
  };

  handleClose = () => {
    this.setState({
      modal: {
        show: false,
        dialogs: null
      }
    });
  };

  accept = () => {
    let dialog = this.state.modal.dialogs[
      $('input[name="dialog"]:checked').val()
    ];
    let data = {
      mess: this.props.mess,
      dialog: dialog
    };
    axios.post("api/v1/dialogs?api_token=" + apiToken, data).then(response => {
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        socials[this.props.mess].dialogList.push({
          id: dialog.peer.id,
          name: dialog.title,
          updating: true
        });
      }
    });
    this.handleClose();
  };

  render() {
    let { dialogs } = this.state.modal;
    return (
      <Fragment>
        <div className="d-flex flex-row">
          <div className="d-flex flex-column justify-content-center align-items-center col-5">
            Подключить диалог
          </div>
          <form
            onSubmit={e => this.createDialog(e)}
            className="d-flex flex-column justify-content-center align-items-center col-7"
          >
            <div className="f-flex justify-content-center align-items-center mb-2">
              <input type="text" placeholder="Запрос" ref={this.req} />
            </div>
            <input type="submit" value="Подключить" />
          </form>
        </div>
        <ul className="navbar-nav">
          {socials[this.props.mess].dialogList.map(dialog => (
            <li
              className="nav-item d-flex align-items-center my-1"
              key={dialog.id}
            >
              <Link
                className="nav-link d-flex col-8"
                to={{
                  pathname: "/socials/" + this.props.mess + "/" + dialog.id,
                  state: { name: dialog.name }
                }}
              >
                {dialog.name}
              </Link>
              <input
                checked={dialog.updating}
                className="col-1"
                type="checkbox"
                onChange={e => this.toggleUpdating(e, dialog)}
              />
              <button
                className="btn btn-primary d-flex col-3"
                onClick={() => this.deleteDialog(dialog)}
              >
                удалить
              </button>
            </li>
          ))}
        </ul>
        <Modal show={this.state.modal.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Выберете нужный диалог</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {dialogs
              ? dialogs.map((dialog, i) => (
                  <label className="d-flex align-items-center" key={i}>
                    <input
                      className="mr-2"
                      type="radio"
                      value={i}
                      name="dialog"
                    />
                    {dialog.peer.type === "chat" ? (
                      <Fragment>
                        <img
                          className="mr-4"
                          src={
                            dialog.chat_settings.photo
                              ? dialog.chat_settings.photo.photo_100
                              : "https://vk.com/images/camera_100.png"
                          }
                          width={50 + "px"}
                          height={50 + "px"}
                        />
                        <div>
                          {dialog.title}
                          <br />
                          Участников: {dialog.chat_settings.members_count}
                          <br />
                          {dialog.last_message}
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <img
                          className="mr-4"
                          src={dialog.photo}
                          width={50 + "px"}
                          height={50 + "px"}
                        />
                        <div>
                          {dialog.title}
                          <br />
                          Участников: 2
                          <br />
                          {dialog.last_message}
                        </div>
                      </Fragment>
                    )}
                  </label>
                ))
              : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.accept}>
              Подтвердить
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
