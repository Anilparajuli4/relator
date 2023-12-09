import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigation } from "react-router-dom";
import { auth } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Oauth from "./Oauth";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgetPassword() {
  const [form, setForm] = useState({
    email: "",
  });
  const { email } = form;

  async function forgetPasswordHandle(e) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("reset password successfully");
    } catch (error) {
      toast.error("something went wrong");
    }
  }

  return (
    <div className="w-full bg-lime-50 h-screen">
      <h1 className="text-3xl text-center mt-6 font-bold">Sign in</h1>
      <div className="flex max-w-6xl justify-center items-center flex-wrap px-6 py-12 mx-auto ">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="h-96"
          />
        </div>
        <div className="w-full md:w-[50%] lg-w-[40%]">
          <form onSubmit={forgetPasswordHandle}>
            <input
              className="w-full mb-3 bg-gray-50 py-2 px-3 border"
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="flex justify-between text-lg ">
              <p>
                Don't have an account?
                <Link to="/sign-up">
                  <span className="text-red-500">Register</span>
                </Link>
              </p>
              <p className="text-blue-500">SignIn instead</p>
            </div>
            <button className="bg-blue-500 w-full px-4 py-2 mt-4 text-white font-medium uppercase">
              Sign in
            </button>
          </form>
          <p>OR</p>
          <Oauth />
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
