import React from "react";
import { Switch, Route } from "react-router-dom";

import Social from "./Social";
import DialogView from "./dialogs/DialogView";

const Socials = () => (
  <div className="container">
    <div className="card">
      <Switch>
        <Route
          exact
          path="/app/socials/:messenger"
          render={browser => <Social mess={browser.match.params.messenger} />}
        />
        <Route
          path="/app/socials/:messenger/dialog/:id/"
          component={DialogView}
        />
      </Switch>
    </div>
  </div>
);

export default Socials;
