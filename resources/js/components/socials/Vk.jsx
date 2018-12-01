import React, { Component } from "react";

const Vk = ({ connect, remove, connected }) => {
  let token = React.createRef();
  let dialogs = connected ? (
    <div>
      <div>dialog1</div>
      <div>dialog2</div>
      <div>dialog3</div>
    </div>
  ) : null;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Example Component</div>

            <div className="card-body">
              <div className="d-flex flex-row">
                <div className="d-flex flex-column justify-content-center align-items-center col-5">
                  Подключение вк
                </div>
                <form
                  onSubmit={e =>
                    connect(
                      "vk",
                      token.current.val,
                      e
                    )
                  }
                  className="d-flex flex-column justify-content-center align-items-center col-7"
                >
                  <div className="f-flex justify-content-center align-items-center mb-2">
                    <input type="text" placeholder="token" ref={token} />
                  </div>
                  <div className="f-flex justify-content-center align-items-center mt-2">
                    <button type="submit">Зарегистрировать</button>
                  </div>
                </form>
              </div>
            </div>
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
            {dialogs}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vk;
