import React, { Component, Fragment } from "react";
import translate from "./../../../functions/translate";
import MessengerConnection from "./MessengerConnection";
import ConnectedMessenger from "./ConnectedMessenger";
import DialogChoosing from "./dialogs/DialogChoosing";

export default class Social extends Component {
  constructor(props) {
    super(props);
    this.mess = socials[this.props.mess];
    this.state = {
      watching: this.mess ? this.mess.watching : null,
      modal: {
        show: false,
        dialogs: null
      }
    };
    this.url = React.createRef();
  }

  componentDidMount() {
    $(".card-header").addClass(this.props.mess);
  }

  componentDidUpdate(prevProps) {
    if (this.props.mess !== prevProps.mess) {
      $(".card-header")
        .removeClass(prevProps.mess)
        .addClass(this.props.mess);
    }
  }

  connect = async (mess, props, watching) => {
    let data = {
      name: mess,
      props: props,
      watching: watching
    };
    await axios
      .post("api/v1/messengers?api_token=" + apiToken, data)
      .then(response => {
        if (response.data.success) {
          if (data.watching === "all") {
            socials[mess] = {
              id: response.data.messengerId,
              updating: true,
              watching: watching,
              dialogList: []
            };

            this.setState({ watching });
          } else {
            this.setState({
              modal: {
                show: true,
                dialogs: response.data.dialogs
              }
            });
          }
        } else {
          let props = {};
          if (response.data.message.substr(0, 14) === "all.error.user") {
            props = {
              user: response.data.message.substr(15)
            };
            response.data.message = "all.error.user";
          }
          alert(translate(response.data.message, props));
          throw new Error(response.data.message);
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
    let { mess } = this.props;
    let { watching, modal } = this.state;

    return (
      <Fragment>
        <div className="card-header">{translate("modules." + mess)}</div>
        <div className="card-body">
          {socials[mess] ? (
            <ConnectedMessenger mess={mess} watching={watching} />
          ) : (
            <MessengerConnection mess={mess} connect={this.connect} />
          )}
        </div>

        {modal.show ? (
          <DialogChoosing
            one={false}
            dialogs={modal.dialogs}
            hide={this.handleClose}
            title={translate("dialog.choose-dialogs")}
            mess={mess}
          />
        ) : null}
      </Fragment>
    );
  }
}
