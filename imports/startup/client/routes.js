import React from "react";

import { createBrowserHistory } from "history";
import App from "../../ui/App.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Home from "../../ui/Dashboard/Home.jsx";
import TagHome from "../../ui/Component/TagHome.jsx";
import SensorHome from "/imports/ui/Component/SensorHome.jsx";
import EventHome from "/imports/ui/Component/events/EventHome.jsx";
import {
  Router,
  Route,
  IndexRoute,
  Switch,
  Redirect,
  useParams
} from "react-router-dom";
const browserHistory = createBrowserHistory();

function ChildSensor() {
  let { codigo, tag } = useParams();
  return <SensorHome codigo={codigo} tag={tag} />;
}

export const Ruteador = () => (
  <Router history={browserHistory}>
    <Switch>
      <App>
        <Route exact path="/tags">
          <TagHome />
        </Route>
        <Route exact path="/mosquitto" component={EventHome} />

        <Route
          exact
          path="/sensorhome/:codigo/:tag"
          children={<ChildSensor />}
        />
      </App>
    </Switch>
  </Router>
);
