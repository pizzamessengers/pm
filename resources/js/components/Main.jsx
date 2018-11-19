import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from "./Home.jsx";
import Example from "./Example.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const Main = () => (
  <main>
    <Switch>
      <Route path='/home' component={Example}/>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
      <Route path='/logout'/>
    </Switch>
  </main>
);

export default Main;
