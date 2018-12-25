import React, { Component, Fragment } from "react";
import { Link, Switch, Route } from "react-router-dom";
import translite from "./../../functions/translite";

export default class Dialogs extends Component {
  constructor(props) {
    super(props);
    this.dialog = React.createRef();
  }

  createDialog = e => {
    e.preventDefault();
    let data = {
      mess: this.props.mess,
      name: this.dialog.current.value
    };
    axios
      .post("/../../api/v1/dialogs?api_token=" + user.apiToken, data)
      .then(response => {
        if (!response.data.success) {
          alert(response.data.message);
        } else {
          user.socials[this.props.mess].dialogs.push({
            id: response.data.dialog.id,
            name: response.data.dialog.name,
            updating: true
          });
          this.forceUpdate();
        }
      });
  };

  deleteDialog = dialog => {
    let data = {
      id: dialog.id
    };
    axios.delete("/../../api/v1/dialogs?api_token=" + user.apiToken, { data });
    user.socials[this.props.mess].dialogs.splice(
      user.socials[this.props.mess].dialogs.map(x => x.id).indexOf(dialog.id),
      1
    );
    this.forceUpdate();
  };

  handleUpdating = (e, dialog) => {
    dialog.updating = e.target.checked;
    this.forceUpdate();
    let data = {
      updating: e.target.checked
    };
    axios.put(
      "/../../api/v1/dialogs/" + dialog.id + "?api_token=" + user.apiToken,
      data
    );
  };

  render() {
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
              <input
                type="text"
                placeholder="Название диалога"
                ref={this.dialog}
              />
            </div>
            <div className="f-flex justify-content-center align-items-center mt-2">
              <input type="submit" value="Подключить" />
            </div>
          </form>
        </div>
        <ul className="navbar-nav">
          {user.socials[this.props.mess].dialogs.map(dialog => {
            return (
              <li
                className="nav-item d-flex align-items-center my-1"
                key={dialog.id}
              >
                <Link
                  className="nav-link d-flex col-8"
                  to={{
                    pathname:
                      "/socials/" +
                      this.props.mess +
                      "/" +
                      dialog.id,
                    state: { name: dialog.name }
                  }}
                >
                  {dialog.name}
                </Link>
                <input
                  checked={dialog.updating}
                  className="col-1"
                  type="checkbox"
                  onChange={e => this.handleUpdating(e, dialog)}
                />
                <button
                  className="btn btn-primary d-flex col-3"
                  onClick={() => this.deleteDialog(dialog)}
                >
                  удалить
                </button>
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  }
}
