import React from "react";
import spinner from "../assets/svg/spinner.svg";

function Spinner() {
  return (
    <div
      className="flex bg-black bg-opacity-5 z-50 justify-center items-center mt-20 left-0 right-0 bottom-0
    top-0 fixed"
    >
      <img src={spinner} alt="loading" className="h-32" />
    </div>
  );
}

export default Spinner;
