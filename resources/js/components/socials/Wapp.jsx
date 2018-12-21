import React, { Component } from "react";
import Dialogs from "./Dialogs.jsx";

const Wapp = ({ connect, remove, connected }) => {
  let token = React.createRef();

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">ВотсАпп</div>

            <div className="card-body">
              {connected ? (
                <div className="text-center mb-3">Подключено</div>
              ) : (
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column justify-content-center align-items-center col-5">
                    Подключение вотс
                  </div>
                  <form
                    onSubmit={e =>
                      connect(
                        "wapp",
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
                <div className="d-flex flex-row">
                  <form
                    onSubmit={e => remove("wapp", e)}
                    className="d-flex flex-column justify-content-center align-items-center col-12"
                  >
                    <div className="f-flex justify-content-center align-items-center mt-2">
                      <button type="submit">Удалить</button>
                    </div>
                  </form>
                </div>
              ) : null}
              {connected ? (<Dialogs mess={'wapp'}/>) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wapp;
