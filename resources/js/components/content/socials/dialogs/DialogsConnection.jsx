import React, { Component, Fragment } from "react";
import translate from "./../../../../functions/translate";
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
        this.q.current.value = "";
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
            alert(translate('connection.dialogs.ok'));
          }
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
    let { dialogs } = this.state.modal;
    return (
      <Fragment>
        <div className="dialogs-connection d-flex flex-column flex-sm-row">
          <div className="col-sm-7 text-center text-sm-left mb-4 mb-sm-0 setting-name">
            {translate("dialog.connect")}
          </div>
          <div className="d-flex justify-content-center col-sm-5">
            <form
              onSubmit={e => this.createDialog(e)}
              className="d-flex flex-column align-items-center"
            >
              <div className="f-flex justify-content-center align-items-center mb-2">
                <input
                  type="text"
                  placeholder={translate("all.query")}
                  ref={this.q}
                />
              </div>
              <input
                className="main-button"
                type="submit"
                value={translate("connection.all.connect")}
              />
            </form>
          </div>
        </div>
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
