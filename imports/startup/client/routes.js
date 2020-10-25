import React from "react";
import { Router, Route, Switch } from "react-router";
//import createBrowserHistory from "history/createBrowserHistory";
import { createBrowserHistory, History } from "history";

// route components
import App from "../../ui/App.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Home from "../../ui/Dashboard/Home.jsx";

const browserHistory = createBrowserHistory();

export const Ruteador = () => (
  <Router history={browserHistory}>
    <Switch>
      <App>
        <Route exact path="/home" component={Home} />
      </App>
    </Switch>
  </Router>
);
