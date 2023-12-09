import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/Firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Oauth from "./Oauth";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { email, password, name } = form;

  async function signUpHandle(e) {
    e.preventDefault();
    try {
      const userCridential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      updateProfile(auth.currentUser, { displayName: name });
      const user = userCridential.user;
      const formatCopy = { ...form };
      delete formatCopy.password;
      formatCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formatCopy);
      toast.success("sign up successfully");
    } catch (error) {
      toast.error("something went wrong");
    }
  }
  return (
    <div className="w-full bg-lime-50 h-screen">
      <h1 className="text-3xl text-center mt-6 font-bold">Sign up</h1>
      <div className="flex max-w-6xl justify-center items-center flex-wrap px-6 py-12 mx-auto ">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="h-96"
          />
        </div>
        <div className="w-full md:w-[50%] lg-w-[40%]">
          <form onSubmit={signUpHandle}>
            <input
              className="w-full mb-3 bg-gray-50 py-2 px-3 border"
              type="text"
              placeholder="Email address"
              value={name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full mb-3 bg-gray-50 py-2 px-3 border"
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative">
              <input
                className="w-full mb-3 bg-gray-50 py-2 px-3 border "
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {showPassword ? (
                <IoMdEyeOff
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <IoMdEye
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>

            <div className="flex justify-between text-lg ">
              <p>
                Do you have an account?
                <Link to="/sign-in">
                  <span className="text-red-500">Sign in</span>
                </Link>
              </p>
              <p className="text-blue-500">Forget password</p>
            </div>
            <button className="bg-blue-500 w-full px-4 py-2 mt-4 text-white font-medium uppercase">
              Sign up
            </button>
          </form>
          <p>OR</p>
          <Oauth />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
