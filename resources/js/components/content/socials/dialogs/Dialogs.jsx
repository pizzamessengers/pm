import React, { Component } from "react";
import LinkedDialog from "./LinkedDialog";
import Dialog from "./Dialog";
import DialogController from "./DialogController";

export default class Dialogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogs: this.props.dialogs
    };
  }

  toggleUpdating = dialog => {
    dialog.updating = !dialog.updating;
    axios.put("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken);
    this.forceUpdate();
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

  render() {
    let { dialogs } = this.state;
    let { withController, linked, fromMessagesWindow } = this.props;

    return dialogs.length > 0 ? (
      <ul className="list">
        {dialogs.map((dialog, i) => (
          <li key={i} className="nav-item d-flex align-items-center my-1 w-100">
            {withController ? (
              <DialogController
                toggleUpdating={this.toggleUpdating}
                deleteDialog={this.deleteDialog}
                dialog={dialog}
                mess={dialog.mess}
              />
            ) : linked ? (
              <LinkedDialog
                dialog={dialog}
                mess={dialog.mess}
                fromMessagesWindow={fromMessagesWindow}
              />
            ) : (
              <Dialog dialog={dialog} />
            )}
          </li>
        ))}
      </ul>
    ) : (
      <div className="no-messages-wrapper">
        <div className="no-messages">
          У вас еще не было новых сообщений с момента запуска сервиса
        </div>
      </div>
    );
  }
}
