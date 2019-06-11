import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Accept from "./../../elements/Accept";
import Dialog from "./Dialog";
import CheckBox from "./../../elements/CheckBox";

export default class DialogController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating:
        this.props.dialog.updating !== undefined
          ? this.props.dialog.updating
          : true,
      modal: {
        show: false,
        dialogId: null
      }
    };
  }

  toggleUpdating = e => {
    let { dialog, mess } = this.props;
    this.setState({ updating: !this.state.updating });
    axios
      .put("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken)
      .then(r => {
        if (
          r.data.success &&
          mess === "vk" &&
          dialog.token === null &&
          this.state.updating
        ) {
          window.location =
            "https://oauth.vk.com/authorize?client_id=6995405&display=popup&redirect_uri=" +
            window.location.href + "&group_ids=" +
            dialog.dialog_id + "&scope=manage,messages,photos&response_type=code&v=5.95";
        }
      });
  };

  deleteDialog = dialogId => {
    this.setState({ modal: { show: true, dialogId: dialogId } });
  };

  modalHide = () => {
    this.setState({ modal: { show: false, dialogId: null } });
  };

  accept = () => {
    this.props.deleteDialog(this.state.modal.dialogId);
    this.modalHide();
  };

  render() {
    let { updating, modal } = this.state;
    let { dialog, mess } = this.props;

    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-between">
          <Dialog dialog={dialog} withController={true} />
          <div className="d-flex align-items-center px-2">
            <CheckBox
              checked={updating}
              handleChange={this.toggleUpdating}
              name={dialog.id}
              withOn
            />
            <button
              className="btn btn-delete btn-delete-controller col-3"
              onClick={() => this.deleteDialog(dialog.id)}
            >
              <FontAwesomeIcon className="icon close-icon" icon="times" />
            </button>
          </div>
        </div>
        <Accept show={modal.show} hide={this.modalHide} accept={this.accept} />
      </Fragment>
    );
  }
}
