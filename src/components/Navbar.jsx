import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";

function Navbar() {
  const path = useLocation().pathname;
  const [pageState, setPageState] = useState("sign in");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("profile");
      } else {
        setPageState("sign in");
      }
    });
  }, []);
  return (
    <header className="w-full bg-white shadow-sm border-b py-3">
      <div className="flex justify-between max-w-6xl mx-auto items-center">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-7"
          />
        </div>
        <ul className="flex space-x-7 text-gray-500 font-medium">
          <Link to="/">
            <li
              className={
                path === "/"
                  ? "border-b-2 border-red-600 text-black font-semibold"
                  : ""
              }
            >
              Home
            </li>
          </Link>
          <Link to="/offers">
            <li
              className={
                path === "/offers"
                  ? "border-b-2 border-red-600 text-black font-semibold"
                  : ""
              }
            >
              Offers
            </li>
          </Link>
          <Link to={pageState === "profile" ? "/profile" : "/sign-in"}>
            <li
              className={
                path === "/sign-in"
                  ? "border-b-2 border-red-600 text-black font-semibold"
                  : ""
              }
            >
              {pageState}
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
