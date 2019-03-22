import React, { Component, Fragment } from "react";
import LinkedDialog from "./LinkedDialog";
import CheckBox from "./../../elements/CheckBox";

export default class DialogController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: this.props.dialog.updating
    };
  }

  toggleUpdating = dialog => {
    dialog.updating = !dialog.updating;
    this.setState({ updating: dialog.updating });
    axios.put("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken);
  };

  render() {
    let { updating } = this.state;
    let { dialog, deleteDialog, mess } = this.props;

    return (
      <Fragment>
        <LinkedDialog dialog={dialog} mess={mess} />
        <CheckBox
          checked={updating}
          handleChange={e => this.toggleUpdating(e)}
          name={dialog.id}
          withOn
        />
        <button
          className="btn btn-delete col-3"
          onClick={() => deleteDialog(dialog)}
        >
          удалить
        </button>
      </Fragment>
    );
  }
}

DialogController;
