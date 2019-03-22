import React, { Component, Fragment } from "react";

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
            className="btn btn-primary mb-3"
            href="https://oauth.vk.com/authorize?client_id=6869374&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=messages,offline,video&response_type=token&v=5.92"
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
          <input type="text" placeholder="url" ref={this.urlInput} />
          <button onClick={this.processUrlInput}>Далее</button>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>,
      <Fragment>
        <div className="operation">
            <div className="watching-choosing" onClick={() => this.connect('all')}>all</div>
            <div className="watching-choosing" onClick={() => this.connect('dialogs')}>dialogs</div>
        </div>
        <div className="instruction">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. In, eum!
        </div>
      </Fragment>
    ];
    this.token = null;
  }

  connect = watching => {
    if (this.token) {
      this.props.connect(
        "vk",
        {
          token: this.token
        },
        watching,
      );
    }
  };

  processUrlInput = () => {
    let url = this.urlInput.current.value;
    this.setState({ stage: 2 });
    this.token = url.substring(45, url.indexOf("&", 45));
  };

  handleWatchingChoosing = () => {

  }

  render() {
    let { stage } = this.state;
    return this.stages[stage];
  }
}
