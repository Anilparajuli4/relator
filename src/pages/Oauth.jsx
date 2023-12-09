import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, db } from "../firebase/Firebase";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

function Oauth() {
  async function googleHandle(e) {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      console.log(user);
    } catch (error) {
      toast.error("something went wrong");
    }
  }
  return (
    <div>
      <form onSubmit={googleHandle}>
        <button className="bg-red-500 w-full px-4 py-2 mt-4 text-white font-medium uppercase">
          Continue with google
        </button>
      </form>
    </div>
  );
}

export default Oauth;
