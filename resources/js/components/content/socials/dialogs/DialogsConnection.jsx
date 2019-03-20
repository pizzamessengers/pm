import React, { Component, Fragment } from "react";
import Dialogs from "./Dialogs";
import DialogChoosing from "./DialogChoosing";

export default class DialogsConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        show: false,
        dialogs: null
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

  handleClose = () => {
    this.setState({
      modal: {
        show: false,
        dialogs: null
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
          <Dialogs
            dialogs={socials[this.props.mess].dialogList}
            withController={true}
          />
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
