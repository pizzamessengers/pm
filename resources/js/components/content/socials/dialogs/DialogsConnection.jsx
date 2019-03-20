import React, { Component, Fragment } from "react";
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
            Подключить диалог
          </div>
          <form
            onSubmit={e => this.createDialog(e)}
            className="d-flex flex-column justify-content-center align-items-center col-7"
          >
            <div className="f-flex justify-content-center align-items-center mb-2">
              <input type="text" placeholder="Запрос" ref={this.q} />
            </div>
            <input type="submit" value="Подключить" />
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
            title="Выберете нужный диалог"
            mess={this.props.mess}
          />
        ) : null}
      </Fragment>
    );
  }
}
