import React from "react";
import { UserAuthStatus } from "../hooks/UserAuthStatus";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";

function PrivateRoute() {
  const { loggedIn, checkStatus } = UserAuthStatus();
  if (checkStatus) {
    return <Spinner />;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
