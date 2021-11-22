import React from "react";
import { Route } from "react-router-dom";
import { Login, Register } from "../pages";

const ROUTES = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
];

const Routes = () => {
  return (
    <>
      {ROUTES.map((route, index) => (
        <Route
          key={index}
          exact
          path={route.path}
          component={route.component}
        />
      ))}
    </>
  );
};

export default Routes;
