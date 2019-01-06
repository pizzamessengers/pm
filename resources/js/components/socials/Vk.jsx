import React, { Component, Fragment } from "react";
import Dialogs from "./Dialogs.jsx";

export default class Vk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watching: user.socials.vk.watching
    };
    this.token = React.createRef();
  }

  toggleWatching = e => {
    let watching = this.state.watching === "all" ? "dialogs" : "all";
    this.setState({ watching });
    axios.put(
      "api/v1/messengers/" + user.socials.vk.id + "?api_token=" + user.apiToken,
      { watching }
    );
  };

  render() {
    let { connect, remove, connected } = this.props;
    let { watching } = this.state;
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Вконтакте</div>

              <div className="card-body">
                {connected ? (
                  <Fragment>
                    <div className="text-center mb-3">Подключено</div>
                    <div className="d-flex flex-row">
                      <form
                        onSubmit={e => remove("vk", e)}
                        className="d-flex flex-column justify-content-center align-items-center col-12"
                      >
                        <div className="f-flex justify-content-center align-items-center mt-2">
                          <button type="submit">Удалить</button>
                        </div>
                      </form>
                    </div>
                    <input
                      type="checkbox"
                      checked={watching}
                      onChange={e => this.toggleWatching(e)}
                      id="toggleWatching"
                    />
                    <label htmlFor="toggleWatching">
                      {watching === "dialogs" ? "dialogs" : "all"}
                    </label>
                    {watching === "dialogs" ? <Dialogs mess={"vk"} /> : null}
                  </Fragment>
                ) : (
                  <div className="d-flex flex-row">
                    <div className="d-flex flex-column justify-content-center align-items-center col-5">
                      Подключение вк
                    </div>
                    <form
                      onSubmit={e => {
                        connect(
                          "vk",
                          this.token.current.value,
                          $("input[name='watching']:checked").val(),
                          e
                        );
                        this.setState({
                          watching: $("input[name='watching']:checked").val()
                        });
                      }}
                      className="d-flex flex-column justify-content-center align-items-center col-7"
                    >
                      <div>
                        <input
                          type="text"
                          placeholder="token"
                          ref={this.token}
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
