import React, { Component, Fragment } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

import Vk from "./Vk";
import Inst from "./Inst";
import Wapp from "./Wapp";
import Dialog from "./Dialog";

export default class Socials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: {
        show: false,
        dialogs: null
      }
    };
  }

  connect = (mess, props, watching, e) => {
    e.preventDefault();
    let data = {
      name: mess,
      props: props,
      watching: watching
    };
    axios
      .post("api/v1/messengers?api_token=" + apiToken, data)
      .then(response => {
        if (response.data.success) {
          if (data.watching === 'all') {
            socials[mess] = [];
            socials[mess].id = response.data.messenger.id;
            socials[mess].updating = true;
            socials[mess].watching = watching;
            socials[mess].dialogList = [];
            this.forceUpdate();
          } else {
            this.setState({
              modal: {
                show: true,
                dialogs: response.data.dialogs
              }
            })
          }
        }
      });
  };

  remove = mess => {
    socials[mess] = null;
    this.forceUpdate();
    let data = {
      name: mess
    };
    axios.delete("api/v1/messengers?api_token=" + apiToken, { data });
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
    console.log(this.state.modal);
    return (
      <Fragment>
        <div className="d-flex col-12 justify-content-around my-3">
          <Link to="/socials/vk">vk</Link>
          <Link to="/socials/inst">inst</Link>
          <Link to="/socials/wapp">wapp</Link>
        </div>

        <Switch>
          <Route
            exact
            path="/socials/vk"
            render={() => <Vk connect={this.connect} remove={this.remove} />}
          />
          <Route
            exact
            path="/socials/inst"
            render={() => <Inst connect={this.connect} remove={this.remove} />}
          />
          <Route
            exact
            path="/socials/wapp"
            render={() => <Wapp connect={this.connect} remove={this.remove} />}
          />
          <Route path="/socials/:messenger/:dialogId/" component={Dialog} />
        </Switch>
        <Modal show={this.state.modal.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Выберете диалоги</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {dialogs
              ? dialogs.map((dialog, i) => (
                  <label className="d-flex align-items-center" key={i}>
                    <input
                      className="mr-2"
                      type="checkbox"
                      value={i}
                      name="dialog"
                    />
                    <Fragment>
                      <img
                        className="mr-4"
                        src={dialog.photo}
                        width={50 + "px"}
                        height={50 + "px"}
                      />
                      <div>
                        {dialog.title}
                        <br />
                        Участников: {dialog.members_count}
                        <br />
                        {dialog.last_message}
                      </div>
                    </Fragment>
                  </label>
                ))
              : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.accept}>
              Подтвердить
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
