import React, { Component, Fragment } from "react";
import Waiting from "./../elements/Waiting";

export default class VkConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0
    };

    this.urlInput = React.createRef();
    this.stages = [
      <Fragment>
        <div className="operation">
          <a
            target="_blank"
            className="main-button"
            href="https://oauth.vk.com/authorize?client_id=6869374&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=messages,offline,video,photos,docs&response_type=token&v=5.92"
            onClick={() => this.setState({ stage: 1 })}
          >
            Получить токен
          </a>
        </div>
        <div className="instruction">
          <div className="text">
            ВКонтакте подключается с помощью специального токена. После того,
            как вы нажмете на эту кнопку, вы перейдете на страницу авторизации
          </div>
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <form
            className="form"
            onSubmit={e => {
              e.preventDefault();
              this.processUrlInput();
            }}
          >
            <input type="text" placeholder="url" ref={this.urlInput} required />
            <input type="submit" className="main-button" value="Далее" required />
          </form>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
          <div
            className="watching-choosing"
            onClick={() => this.connect("all")}
          >
            all
          </div>
          <div
            className="watching-choosing"
            onClick={() => this.connect("dialogs")}
          >
            dialogs
          </div>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>,
      <Waiting />
    ];
    this.token = null;
  }

  componentDidMount() {
    $(".progress-bar").css("width", "25%");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stage !== prevState.stage) {
      $(".progress-bar").css(
        "width",
        (100 / this.stages.length) * (this.state.stage + 1) + "%"
      );
    }
  }

  connect = watching => {
    this.setState({ stage: 3 });
    if (this.token) {
      this.props.connect(
        "vk",
        {
          token: this.token
        },
        watching
      );
    }
  };

  processUrlInput = () => {
    let url = this.urlInput.current.value;
    this.setState({ stage: 2 });
    this.token = url.substring(45, url.indexOf("&", 45));
  };

  render() {
    let { stage } = this.state;
    return this.stages[stage];
  }
}
