import React from "react";
import { useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

export default function ChangeProfilePicture({ setShowModal }) {
  const [file, setFile] = useState(null);
  const { currentUser } = useAuth();

  const handleFile = (e) => {
    const inputFile = e.target.files[0];
    console.log(inputFile);
    setFile(inputFile);
  };

  const uploadFile = (e) => {
    e.preventDefault();
    console.log("currimg", currentUser.img)
    let formdata = new FormData();

    formdata.append("image", file);
    formdata.append("userId", currentUser._id);

    api
      .put(
        `/api/users/change-img/${currentUser._id}`,
        formdata,
        { headers: { "content-type": "multipart/form-data" } }
      )
      .then((res) => {
        setShowModal(false);
        currentUser.img = res.data
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="modal-centered">Change Profile Picture</h1>
      <hr />
      <form onSubmit={(e) => uploadFile(e)}>
        <input
          type="file"
          name="file"
          className="file-input"
          onChange={(e) => handleFile(e)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
