import React, { Component } from "react";
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
    let { mess } = this.props;
    axios.delete("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken);
    socials[mess].dialogList.splice(
      socials[mess].dialogList.map(x => x.id).indexOf(dialog.id),
      1
    );
    this.setState({ dialogs: socials[mess].dialogList });
  };

  render() {
    let { dialogs } = this.state;
    let { withController, mess } = this.props;

    return (
      <ul className="navbar-nav">
        {dialogs.map((dialog, i) => (
          <li key={i} className="nav-item d-flex align-items-center my-1">
            {withController ? (
              <DialogController
                toggleUpdating={this.toggleUpdating}
                deleteDialog={this.deleteDialog}
                dialog={dialog}
                mess={mess}
              />
            ) : (
              <Dialog dialog={dialog} />
            )}
          </li>
        ))}
      </ul>
    );
  }
}
