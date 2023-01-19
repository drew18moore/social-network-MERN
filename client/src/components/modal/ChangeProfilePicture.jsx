import React, { useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

export default function ChangeProfilePicture({ setShowModal }) {
  const [file, setFile] = useState(null);
  const { currentUser, setCurrentUser } = useAuth();

  const handleFile = (e) => {
    const inputFile = e.target.files[0];
    setFile(inputFile);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("image", file);
    formdata.append("userId", currentUser._id);
    try {
      const response = await api.put(
        `/api/users/change-img/${currentUser._id}`,
        formdata,
        { headers: { "content-type": "multipart/form-data" } }
      );
      setShowModal(false);
      setCurrentUser((prev) => {
        return {
          ...prev,
          img: response.data,
        };
      });
    } catch (err) {
      console.error(err);
    }
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
