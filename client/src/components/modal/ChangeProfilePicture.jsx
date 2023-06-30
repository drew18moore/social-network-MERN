import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../contexts/AuthContext";

export default function ChangeProfilePicture({ setShowModal }) {
  const [file, setFile] = useState(null);
  const { currentUser, setCurrentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();

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
      const response = await axiosPrivate.put(
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
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  return (
    <div>
      <h1 className="modal-centered">Change Profile Picture</h1>
      <hr />
      <form onSubmit={(e) => uploadFile(e)}>
        <input
          type="file"
          accept="image/*"
          name="file"
          className="file-input"
          onChange={(e) => handleFile(e)}
        />
        <button disabled={!file}>Submit</button>
      </form>
    </div>
  );
}
