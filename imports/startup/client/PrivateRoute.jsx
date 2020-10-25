import React, { Fragment } from "react";
import { Meteor } from "meteor/meteor";
import { Router, Route, IndexRoute, Switch, Redirect } from "react-router-dom";

export default (PrivateRoute = props => (
  <Route
    render={({ location }) =>
      Meteor.user() ? (
        props.children
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: location }
          }}
        />
      )
    }
  />
));
