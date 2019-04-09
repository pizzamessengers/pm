import React from "react";
import { Switch, Route } from "react-router-dom";
import UserSettings from "./UserSettings";
import Payment from "./Payment";

const ProfileModuleSettings = ({ match, refresh }) => (
  <div className="module-settings">
    <Switch>
      <Route
        path="/app/settings/profile/user"
        render={() => <UserSettings refresh={refresh} />}
      />
      <Route path={"/app/settings/profile/payment)"} component={Payment} />
    </Switch>
  </div>
);

export default ProfileModuleSettings;
