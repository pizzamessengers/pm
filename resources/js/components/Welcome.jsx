import React, { Component } from "react";
import Auth from "./../contexts/Auth";

const Welcome = () => {


  return(
    <Auth.Consumer>
      {auth => {
        axios.get('/csrf').then((response) => {
          user.csrf = response.data.user.csrf;
          auth.checkAuth();
        });

        return(
          <div>
            <h1>Hello!</h1>
          </div>
        );
      }}
    </Auth.Consumer>
  );
};

export default Welcome;
