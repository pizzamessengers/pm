import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from "./Welcome.jsx";
import Socials from "./Socials.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Welcome}/>
      <Route path='/socials' component={Socials}/>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
    </Switch>
  </main>
);

export default Main;
