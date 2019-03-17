import React from "react";
import { Switch, Route } from "react-router-dom";

import MessengersSettings from "./messengers/MessengersSettings";
import Support from "./support/Support";
import ProfileSettings from "./profile/ProfileSettings";

const Settings = () => (
  <Switch>
    <Route
      path="/app/settings/messenger"
      component={MessengersSettings} />}
    />
    <Route
      path="/app/settings/profile"
      component={ProfileSettings} />}
    />
    <Route
      path="/app/settings/support"
      component={Support} />}
    />
  </Switch>
);

export default Settings;
