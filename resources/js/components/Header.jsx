import { Link } from "react-router-dom";
import React, { Component } from "react";
import Auth from "./../contexts/Auth";

const Header = ({ history }) => {
  let navbarSupportedContent = React.createRef();

  let menu =
    user.isAuth === false ? (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/login"
            onClick={() => {
              $(navbarSupportedContent.current).collapse("hide");
            }}
          >
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/register"
            onClick={() => {
              $(navbarSupportedContent.current).collapse("hide");
            }}
          >
            Register
          </Link>
        </li>
      </ul>
    ) : (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a
            id="navbarDropdown"
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            v-pre="true"
          >
            {user.name} <span className="caret" />
          </a>
          <Auth.Consumer>
            {auth => (
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="navbarDropdown"
              >
                <a
                  className="dropdown-item"
                  onClick={() => {
                    event.preventDefault();
                    axios.post("logout").then(function(response) {
                      user = {};
                      user.isAuth = false;
                      user.csrf = response.data.csrf;
                      auth.checkAuth();
                      history.push("/");
                    });
                  }}
                >
                  Logout
                </a>
              </div>
            )}
          </Auth.Consumer>
        </li>
      </ul>
    );

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-light navbar-laravel">
        <div className="container">
          <Link className="navbar-brand" to="/">
            PizzaMessengers
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
            ref={navbarSupportedContent}
          >
            {menu}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
