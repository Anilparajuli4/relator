import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  connectStorageEmulator,
} from "firebase/storage";
import { auth, db, storage } from "../firebase/Firebase";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "sale",
    bathrooms: 1,
    bedrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regular: 0,
    discount: 0,
    images: {},
  });
  const {
    type,
    bathrooms,
    bedrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regular,
    discount,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //files
    if (e.target.files) {
      setFormData((prevstate) => ({
        ...prevstate,
        images: e.target.files,
      }));
    }
    //text/boolean/Number
    if (!e.target.files) {
      setFormData((prevstate) => ({
        ...prevstate,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (discount >= regular) {
      setLoading(false);
      toast.error("Discount need to be less than regular");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve("File available at", downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discount;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    console.log(docRef);
    setLoading(false);
    toast.success("Listing created");
  }
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center font-bold mt-4">Create a Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="font-semibold text-lg mt-6">Sell/Rent</p>
        <div className="flex ">
          <button
            value="sale"
            type="button"
            id="type"
            onClick={onChange}
            className={`py-2 px-7  w-full uppercase font-medium shadow-md rounded ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-500 text-white"
            }`}
          >
            sale
          </button>
          <button
            value="rent"
            type="button"
            id="type"
            onClick={onChange}
            className={`py-3 px-7 ml-3 w-full font-medium uppercase shadow-md rounded ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-500 text-white"
            }`}
          >
            Rent
          </button>
        </div>
        <div>
          <p className="font-semi-bold text-lg shadow-md mt-6">Name</p>
          <input
            type="text"
            className="w-full py-3 rounded px-3 text-lg"
            placeholder="Name"
            onChange={onChange}
          />
        </div>
        <div className="flex gap-4">
          <div>
            <p className="font-semibold text-lg shadow-md mt-6">Beds</p>
            <input
              type="number"
              className="px-3 py-3 w-full rounded text-lg"
              id="bedrooms"
              min="1"
              max="50"
              value={bedrooms}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <p className="font-semi-bold text-lg shadow-md mt-6">Baths</p>
            <input
              type="number"
              className="px-3 py-3 w-full rounded text-lg"
              id="bathrooms"
              min="1"
              max="50"
              value={bathrooms}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <p className="font-semibold text-lg mt-6">Parking/spot</p>
        <div className="flex ">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`py-3 px-7  w-full uppercase shadow-md rounded ${
              !parking ? "bg-white text-black" : "bg-slate-500 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`py-2 px-7 ml-3 w-full uppercase shadow-md rounded ${
              parking ? "bg-white text-black" : "bg-slate-500 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="font-semibold text-lg mt-6">furnished</p>
        <div className="flex ">
          <button
            id="furnished"
            type="button"
            value={true}
            onClick={onChange}
            className={`py-3 px-7  w-full uppercase shadow-md rounded ${
              !furnished ? "bg-white text-black" : "bg-slate-500 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`py-2 px-7 ml-3 w-full uppercase shadow-md rounded ${
              furnished ? "bg-white text-black" : "bg-slate-500 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="font-semibold text-lg mt-6">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          placeholder="Address"
          onChange={onChange}
          required
          className="px-3 py-3 w-full rounded text-lg"
        />
        <p className="font-semibold text-lg mt-6">Description</p>
        <textarea
          type="text"
          value={description}
          placeholder="Description"
          onChange={onChange}
          id="description"
          required
          className="px-3 py-3 w-full rounded text-lg"
        />
        <p className="font-semibold text-lg mt-6">Offer</p>
        <div className="flex ">
          <button
            id="offer"
            type="button"
            value={true}
            onClick={onChange}
            className={`py-3 px-7  w-full uppercase shadow-md rounded ${
              !offer ? "bg-white text-black" : "bg-slate-500 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`py-2 px-7 ml-3 w-full uppercase shadow-md rounded ${
              offer ? "bg-white text-black" : "bg-slate-500 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="font-semibold text-lg mt-6">Regular Price</p>
        <div className="flex ">
          <input
            type="number"
            className="px-3 py-3 w-full rounded text-lg"
            id="regular"
            min="1"
            value={regular}
            onChange={onChange}
            required
          />
          <p className="font-semi-bold text-lg shadow-md mt-6 ml-4 text-center">
            $/Month
          </p>
        </div>
        {offer && (
          <div className="mt-6">
            <p className="font-semibold text-lg">Discounted Price</p>
            <input
              type="number"
              className="px-3 py-3 w-[50%] rounded text-lg"
              id="discount"
              min="50"
              max="40000000"
              value={discount}
              onChange={onChange}
              required
            />
          </div>
        )}
        <div className="mt-3">
          <p className="font-semibold text-lg">Images</p>
          <p>The first images will be the cover (max6)</p>
          <input
            type="file"
            id="images"
            accept=".jpg, .png, .jpeg"
            onChange={onChange}
            multiple
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 w-full px-6 py-3 uppercase rounded mt-8 mb-2 text-white"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
