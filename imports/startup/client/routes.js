import React from "react";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import App from "../../ui/App.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Home from "../../ui/Dashboard/Home.jsx";
import TagHome from "../../ui/Component/TagHome.jsx";
import EventHome from "/imports/ui/Component/events/EventHome.jsx";

const browserHistory = createBrowserHistory();

export const Ruteador = () => (
  <Router history={browserHistory}>
    <Switch>
      <App>
        <Route exact path="/tags">
          <TagHome />
        </Route>
        <Route exact path="/mosquitto" component={EventHome} />
      </App>
    </Switch>
  </Router>
);
