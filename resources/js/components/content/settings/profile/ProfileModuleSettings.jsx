import React from "react";
import { Switch, Route } from "react-router-dom";
import UserSettings from "./UserSettings";
import Payment from "./Payment";

const ProfileModuleSettings = ({ match }) => (
  <div className="module-settings">
    <Switch>
      <Route
        path="/app/settings/profile/user"
        component={UserSettings}
      />
      <Route
        path={"/app/settings/profile/payment)"}
        component={Payment}
      />
    </Switch>
  </div>
);

export default ProfileModuleSettings;
