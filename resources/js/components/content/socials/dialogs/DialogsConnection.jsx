import React, { Component, Fragment } from "react";
import translate from "./../../../../functions/translate";
import DialogController from "./DialogController";
import DialogChoosing from "./DialogChoosing";

export default class DialogsConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        show: false,
        dialogs: []
      }
    };
    this.q = React.createRef();
  }

  createDialog = e => {
    e.preventDefault();
    let data = {
      mess: this.props.mess
    };
    axios
      .post(
        "api/v1/dialogs?q=" + this.q.current.value + "&api_token=" + apiToken,
        data
      )
      .then(response => {
        if (!response.data.success) {
          let props = {};
          if (response.data.message.substr(0, 14) === "all.error.user") {
            response.data.message = "response.data.message";
            props = {
              user: response.data.message.substr(15)
            };
          }
          alert(translate(response.data.message, props));
        } else {
          if (response.data.needChoose) {
            this.setState({
              modal: {
                show: true,
                dialogs: response.data.dialogs
              }
            });
          } else {
            let dialog = response.data.dialogList[0];
            socials[this.props.mess].dialogList.push({
              id: dialog.id,
              name: dialog.name,
              last_message: dialog.last_message,
              members_count: dialog.members_count,
              photo: dialog.photo,
              updating: true
            });
          }
          this.forceUpdate();
        }
      });
  };

  deleteDialog = dialog => {
    let mess = dialog.mess;
    axios.delete("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken);
    socials[mess].dialogList.splice(
      socials[mess].dialogList.map(x => x.id).indexOf(dialog.id),
      1
    );
    this.setState({ dialogs: socials[mess].dialogList });
  };

  handleClose = () => {
    this.setState({
      modal: {
        show: false,
        dialogs: []
      }
    });
  };

  render() {
    let { dialogs } = this.state.modal;
    return (
      <Fragment>
        <div className="d-flex flex-row">
          <div className="d-flex flex-column justify-content-center align-items-center col-5">
            {translate("dialog.connect")}
          </div>
          <form
            onSubmit={e => this.createDialog(e)}
            className="d-flex flex-column justify-content-center align-items-center col-7"
          >
            <div className="f-flex justify-content-center align-items-center mb-2">
              <input type="text" placeholder={translate("all.query")} ref={this.q} />
            </div>
            <input type="submit" value={translate("connection.all.connect")} />
          </form>
        </div>
        {socials[this.props.mess].dialogList ? (
          <ul className="list">
            {socials[this.props.mess].dialogList.map((dialog, i) => (
              <li
                key={i}
                className="nav-item d-flex align-items-center my-1 w-100"
              >
                <DialogController
                  deleteDialog={this.deleteDialog}
                  dialog={dialog}
                  mess={dialog.mess}
                />
              </li>
            ))}
          </ul>
        ) : null}
        {this.state.modal.show ? (
          <DialogChoosing
            one={true}
            dialogs={dialogs}
            hide={this.handleClose}
            title={translate("dialog.choose-dialog")}
            mess={this.props.mess}
          />
        ) : null}
      </Fragment>
    );
  }
}
