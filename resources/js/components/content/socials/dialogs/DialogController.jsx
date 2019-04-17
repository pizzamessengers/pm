import React, { Component } from "react";
import translate from "./../../../../functions/translate";
import LinkedDialog from "./LinkedDialog";
import CheckBox from "./../../elements/CheckBox";

export default class DialogController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: this.props.dialog.updating
    };
  }

  toggleUpdating = e => {
    let { dialog } = this.props;
    this.setState({ updating: !this.state.updating });
    axios.put("api/v1/dialogs/" + dialog.id + "?api_token=" + apiToken);
  };

  render() {
    let { updating } = this.state;
    let { dialog, deleteDialog, mess } = this.props;

    return (
      <div className="d-md-flex align-items-center justify-content-around">
        <LinkedDialog dialog={dialog} mess={mess} />
        <div className="d-flex align-items-center justify-content-center pt-2 pb-3 py-md-0 px-md-3">
          <CheckBox
            checked={updating}
            handleChange={this.toggleUpdating}
            name={dialog.id}
            withOn
          />
          <button
            className="btn btn-delete col-3"
            onClick={() => deleteDialog(dialog.id)}
          >
            {translate("all.delete")}
          </button>
        </div>
      </div>
    );
  }
}
