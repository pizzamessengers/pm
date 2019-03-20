import React, { Component } from "react";

export default class VkConnection extends Component {
  constructor(props) {
    super(props);

    this.url = React.createRef();
  }

  token = () => {
    let url = this.url.current.value;
    return url.substring(45, url.indexOf("&", 45));
  };

  render() {
    let { connect } = this.props;
    return (
      <div className="d-flex flex-column justify-content-center align-items-center col-7">
        <a
          target="_blank"
          className="btn btn-primary mb-3"
          href="https://oauth.vk.com/authorize?client_id=6869374&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=messages,offline,video&response_type=token&v=5.92"
        >
          Получить токен
        </a>
        <form
          onSubmit={e => {
            e.preventDefault();
            axios
              .post("https://api.vk.com/method/execute.send?access_token=dcbbf9c537bdcc58f9c4ad966bf5f1ba1cf8a2c2c32d2fac8efcc4590da5af7dd2133e8e068cb7962d0da&v=5.92")
              .then(function(response) {
              });
            /*connect(
              "vk",
              { token: this.token() },
              $("input[name='watching']:checked").val(),
              e
            );*/
          }}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div>
            <input type="text" placeholder="url" ref={this.url} />
          </div>
          <div className="my-2">
            <input type="radio" value="all" name="watching" id="all" />
            <label htmlFor="all">all</label>
            <input type="radio" value="dialogs" name="watching" id="dialogs" />
            <label htmlFor="dialogs">dialogs</label>
          </div>
          <div>
            <input type="submit" value="Зарегистрировать" />
          </div>
        </form>
      </div>
    );
  }
}
