import React, { Component, Fragment } from "react";
import DialogChoosing from "./DialogChoosing";

export default class DialogsConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: "",
      modal: {
        show: false,
        dialogs: []
      }
    };
  }

  handleChange = e => {
    this.setState({ q: e.target.value });
  };

  createDialog = e => {
    e.preventDefault();
    this.props.connectionOn();
    let data = {
      mess: this.props.mess
    };
    axios
      .post("api/v1/dialogs?q=" + this.state.q + "&api_token=" + apiToken, data)
      .then(response => {
        this.setState({ q: "" });
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
          }

          this.props.connectDialogs(response.data.dialogList);
        }
      });
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
    let { modal } = this.state;
    return (
      <Fragment>
        <div className="dialogs-connection d-flex flex-column flex-md-row">
          <div className="col-md-6 d-flex align-items-center justify-content-center justify-content-md-start mb-4 mb-md-0 setting-name">
            {translate("dialog.connect")}
          </div>
          <div className="d-flex justify-content-center col-md-6">
            <form
              onSubmit={e => this.createDialog(e)}
              className="d-flex align-items-center"
            >
              <input
                className="mr-2"
                type="text"
                placeholder={translate("all.query")}
                onChange={e => this.handleChange(e)}
              />
              <input className="main-button" type="submit" value="Ok" />
            </form>
          </div>
        </div>
        {modal.show ? (
          <DialogChoosing
            one={true}
            dialogs={modal.dialogs}
            hide={this.handleClose}
            title={translate("dialog.choose-dialog")}
            mess={this.props.mess}
          />
        ) : null}
      </Fragment>
    );
  }
}
