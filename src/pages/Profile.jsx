import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName,
  });
  const [edit, setEdit] = useState(false);

  const { email, name } = form;

  async function logOutHandle() {
    auth.signOut();
    toast.success("logout successfully");
    navigate("/sign-in");
  }

  function changeDetail(e) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }
  async function editHandle() {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const docRef = doc(db, "users", auth.currentUser.uid);

        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("edit successfully");
    } catch (error) {
      toast.error("something went wrong in editing");
    }
  }
  function onSubmit(e) {
    e.preventDefault();
    navigate("/create-listing");
  }
  return (
    <div className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className="text-center text-3xl">Profile</h1>
      <div className=" md:w-[56%] mt-6 px-3">
        <form onSubmit={onSubmit}>
          <input
            className="w-full  mb-3 bg-gray-50 py-2 px-3 border "
            type="text"
            value={name}
            id="name"
            onChange={changeDetail}
            disabled={!edit}
          />
          <input
            className="w-full mb-3  bg-gray-50 py-2 px-3 border "
            type="email"
            id="email"
            value={email}
            disabled
          />
          <div className="flex justify-between text-lg ">
            <p>
              Do you want to change your name?
              <span
                className="text-red-500 cursor-pointer ml-2"
                onClick={() => {
                  editHandle() && changeDetail;
                  setEdit((prev) => !prev);
                }}
              >
                {edit ? "apply change" : "Edit"}
              </span>
            </p>
            <p onClick={logOutHandle} className="text-blue-500 cursor-pointer">
              Sign Out
            </p>
          </div>
          <button className="bg-blue-500 w-full  px-4 py-2 mt-4 text-white font-medium uppercase">
            Sell or rent your home
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
