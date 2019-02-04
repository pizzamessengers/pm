import React, { Component, Fragment } from "react";
import Dialogs from "./Dialogs.jsx";
import Messages from "./Messages.jsx";

export default class Vk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: socials.inst ? socials.inst.updating : null,
      watching: socials.inst ? socials.inst.watching : null
    };
    this.login = React.createRef();
    this.password = React.createRef();
  }

  toggleWatching = () => {
    let watching;
    if (this.state.watching === "all") {
      watching = "dialogs";
      socials.inst.dialogList = [];
    } else {
      watching = "all";
      socials.inst.dialogList.forEach(function(item) {
        item.updating = false;
      });
    }
    this.setState({ watching });
    socials.inst.watching = watching;
    axios.put(
      "api/v1/messengers/watching/" +
        socials.inst.id +
        "?api_token=" +
        apiToken,
      { watching }
    );
  };

  toggleUpdating = e => {
    let updating = e.target.checked;
    this.setState({ updating });
    socials.inst.updating = updating;
    axios.put(
      "api/v1/messengers/updating/" + socials.inst.id + "?api_token=" + apiToken
    );
  };

  render() {
    let { connect, remove } = this.props;
    let { updating, watching } = this.state;
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Инстаграм</div>

              <div className="card-body">
                {socials.inst ? (
                  <Fragment>
                    <div className="text-center mb-3">Подключено</div>
                    <div className="d-flex justify-content-center align-items-center">
                      <input
                        type="checkbox"
                        checked={socials.inst.updating}
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
                      <button onClick={e => remove("inst", e)} type="submit">
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
                      <Dialogs mess={"inst"} />
                    ) : (
                      <Messages mess={"inst"} />
                    )}
                  </Fragment>
                ) : (
                  <div className="d-flex flex-row">
                    <div className="d-flex flex-column justify-content-center align-items-center col-5">
                      Подключение инст
                    </div>
                    <form
                      onSubmit={e => {
                        connect(
                          "inst",
                          {
                            login: this.login.current.value,
                            password: this.password.current.value
                          },
                          $("input[name='watching']:checked").val(),
                          e
                        );
                        this.setState({
                          watching: $("input[name='watching']:checked").val(),
                          updating: true
                        });
                      }}
                      className="d-flex flex-column justify-content-center align-items-center col-7"
                    >
                      <div>
                        <input
                          type="text"
                          placeholder="login"
                          ref={this.login}
                        />
                        <input
                          type="text"
                          placeholder="password"
                          ref={this.password}
                        />
                      </div>
                      <div className="my-2">
                        <input
                          type="radio"
                          value="all"
                          name="watching"
                          id="all"
                        />
                        <label htmlFor="all">all</label>
                        <input
                          type="radio"
                          value="dialogs"
                          name="watching"
                          id="dialogs"
                        />
                        <label htmlFor="dialogs">dialogs</label>
                      </div>
                      <div>
                        <input type="submit" value="Зарегистрировать" />
                      </div>
                    </form>
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
