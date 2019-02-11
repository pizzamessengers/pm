import React, { Component, Fragment } from "react";
import Dialogs from "./Dialogs.jsx";
import Messages from "./Messages.jsx";

export default class Wapp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionStage: !socials.wapp ? 0 : null,
      updating: socials.wapp ? socials.wapp.updating : null,
      watching: socials.wapp ? socials.wapp.watching : null
    };
    this.token = null;
    this.url = null;
    this.qr = null;
  }

  toggleWatching = () => {
    let watching;
    if (this.state.watching === "all") {
      watching = "dialogs";
      socials.wapp.dialogList = [];
    } else {
      watching = "all";
      socials.wapp.dialogList.forEach(function(item) {
        item.updating = false;
      });
    }
    this.setState({ watching });
    socials.wapp.watching = watching;
    axios.put(
      "api/v1/messengers/watching/" +
        socials.wapp.id +
        "?api_token=" +
        apiToken,
      { watching }
    );
  };

  toggleUpdating = e => {
    let updating = e.target.checked;
    this.setState({ updating });
    socials.wapp.updating = updating;
    axios.put(
      "api/v1/messengers/updating/" + socials.wapp.id + "?api_token=" + apiToken
    );
  };

  installWapp = e => {
    e.preventDefault();
    this.token = $("#token").val();
    this.url = $("#url").val();
    axios.get(this.url + "status?token=" + this.token).then(response => {
      switch (response.data.accountStatus) {
        case "got qr code":
          alert("просканируйте код");
          break;
        case "loading":
          this.installWapp(e);
          break;
        case "authenticated":
          this.setState({ connectionStage: 2 });
          break;
      }
    });
  };

  render() {
    let { connect, remove } = this.props;
    let { connectionStage, updating, watching } = this.state;

    let connectionStages = [
      <a
        target="_blank"
        className="btn btn-primary"
        href="https://app.chat-api.com"
        onClick={() => {
          this.setState({ connectionStage: 1 });
        }}
      >
        Получить токен
      </a>,
      <div className="d-flex flex-column justify-content-center align-items-center">
        <input id="url" type="text" placeholder="api url" />
        <input id="token" type="text" placeholder="token" />
        <button onClick={this.installWapp}>Зарегистрировать</button>
      </div>,
      <div>
        <input type="radio" value="all" name="watching" id="all" />
        <label htmlFor="all">all</label>
        <input type="radio" value="dialogs" name="watching" id="dialogs" />
        <label htmlFor="dialogs">dialogs</label>
        <button
          onClick={e => {
            connect(
              "wapp",
              {
                url: this.url,
                token: this.token
              },
              $("input[name='watching']:checked").val(),
              e
            );
            this.setState({
              watching: $("input[name='watching']:checked").val(),
              updating: true
            });
          }}
        >
          Зарегистрировать
        </button>
      </div>
    ];

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Вотсапп</div>

              <div className="card-body">
                {socials.wapp ? (
                  <Fragment>
                    <div className="text-center mb-3">Подключено</div>
                    <div className="d-flex justify-content-center align-items-center">
                      <input
                        type="checkbox"
                        checked={socials.wapp.updating}
                        onChange={e => this.toggleUpdating(e)}
                        id="toggleUpdating"
                      />
                      <label htmlFor="toggleUpdating">
                        {updating
                          ? "обновления включены"
                          : "обновления выключены"}
                      </label>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                      <button onClick={e => remove("wapp", e)} type="submit">
                        Удалить
                      </button>
                    </div>
                    <input
                      type="checkbox"
                      checked={watching}
                      onChange={() => this.toggleWatching()}
                      id="toggleWatching"
                    />
                    <label htmlFor="toggleWatching">
                      {watching === "dialogs" ? "dialogs" : "all"}
                    </label>
                    {watching === "dialogs" ? (
                      <Dialogs mess={"wapp"} />
                    ) : (
                      <Messages mess={"wapp"} />
                    )}
                  </Fragment>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    {connectionStages[connectionStage]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
