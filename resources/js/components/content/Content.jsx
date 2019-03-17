import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import Socials from "./socials/Socials";
import Settings from "./settings/Settings";

const Content = () => {
  return (
    <div className="content">
      <Switch>
        <Route
          path="/app/socials"
          component={Socials}
        />
        <Route
          path="/app/settings"
          component={Settings}
        />
      </Switch>
    </div>
  );
};

export default Content;
