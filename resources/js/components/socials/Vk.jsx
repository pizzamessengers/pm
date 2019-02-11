import React, { Component, Fragment } from "react";
import Dialogs from "./Dialogs.jsx";
import Messages from "./Messages.jsx";

export default class Vk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updating: socials.vk ? socials.vk.updating : null,
      watching: socials.vk ? socials.vk.watching : null
    };
    this.url = React.createRef();
  }

  token = () => {
    let url   = this.url.current.value;
    console.log(url.substring(45, url.indexOf('&', 45)));
    return url.substring(45, url.indexOf('&', 45));
  }

  toggleWatching = () => {
    let watching;
    if (this.state.watching === "all") {
      watching = "dialogs";
      socials.vk.dialogList = [];
    } else {
      watching = "all";
      socials.vk.dialogList.forEach(function(item) {
        item.updating = false;
      });
    }
    this.setState({ watching });
    socials.vk.watching = watching;
    axios.put(
      "api/v1/messengers/watching/" + socials.vk.id + "?api_token=" + apiToken,
      { watching }
    );
  };

  toggleUpdating = e => {
    let updating = e.target.checked;
    this.setState({ updating });
    socials.vk.updating = updating;
    axios.put(
      "api/v1/messengers/updating/" + socials.vk.id + "?api_token=" + apiToken
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
              <div className="card-header">Вконтакте</div>

              <div className="card-body">
                {socials.vk ? (
                  <Fragment>
                    <div className="text-center mb-3">Подключено</div>
                    <div className="d-flex justify-content-center align-items-center">
                      <input
                        type="checkbox"
                        checked={socials.vk.updating}
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
                      <button onClick={e => remove("vk", e)} type="submit">
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
                      <Dialogs mess={"vk"} />
                    ) : (
                      <Messages mess={"vk"} />
                    )}
                  </Fragment>
                ) : (
                  <div className="d-flex">
                    <div className="d-flex flex-column justify-content-center align-items-center col-5">
                      Подключение вк
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center col-7">
                      <a
                        target="_blank"
                        className="btn btn-primary mb-3"
                        href="https://oauth.vk.com/authorize?client_id=6820073&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=messages,offline,video&response_type=token&v=5.92"
                      >
                        Получить токен
                      </a>
                      <form
                        onSubmit={e => {
                          connect(
                            "vk",
                            { token: this.token() },
                            $("input[name='watching']:checked").val(),
                            e
                          );
                          this.setState({
                            watching: $("input[name='watching']:checked").val(),
                            updating: true
                          });
                        }}
                        className="d-flex flex-column justify-content-center align-items-center"
                      >
                        <div>
                          <input
                            type="text"
                            placeholder="url"
                            ref={this.url}
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
