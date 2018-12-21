import React, { Component, Fragment } from "react";
import Dialogs from "./Dialogs.jsx";

const Vk = ({ connect, remove, connected }) => {
  let token = React.createRef();

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Вконтакте</div>

            <div className="card-body">
              {connected ? (
                <div className="text-center mb-3">Подключено</div>
              ) : (
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column justify-content-center align-items-center col-5">
                    Подключение вк
                  </div>
                  <form
                    onSubmit={e =>
                      connect(
                        "vk",
                        token.current.value,
                        e
                      )
                    }
                    className="d-flex flex-column justify-content-center align-items-center col-7"
                  >
                    <div className="f-flex justify-content-center align-items-center mb-2">
                      <input type="text" placeholder="token" ref={token} />
                    </div>
                    <div className="f-flex justify-content-center align-items-center mt-2">
                      <input type="submit" value="Зарегистрировать" />
                    </div>
                  </form>
                </div>
              )}

              {connected ? (
                <Fragment>
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
                  <Dialogs mess={'vk'}/>
                </Fragment>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vk;
