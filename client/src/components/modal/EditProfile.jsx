import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { MdPhotoCamera } from "react-icons/md";
import Resizer from "react-image-file-resizer";
const resizer = Resizer.default || Resizer;

export default function EditProfile({ setUser, setShowModal }) {
  const [profileImgBase64, setProfileImgBase64] = useState(null);
  const fullnameRef = useRef(null);
  const usernameRef = useRef(null);
  const bioRef = useRef(null);
  const [password, setPassword ] = useState("");

  const [error, setError] = useState("");

  const { currentUser, setCurrentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosPrivate.put(`/api/users/${currentUser._id}`, {
        fullname: fullnameRef.current.value.trim() || currentUser.fullname,
        username: usernameRef.current.value.trim().toLowerCase() || currentUser.username,
        bio: bioRef.current.value.trim() || currentUser.bio,
        img: profileImgBase64,
        password: password,
      });
      const { fullname, username, bio, img } = response.data;
      setCurrentUser(prev => ({ ...prev, fullname, username, bio, img }));
      setUser(prev => ({ ...prev, fullname, username, bio, img }));
      setShowModal(false);
      toast.success("Profile has been updated!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        }
      })
      navigate(`/${username}`, { replace: true })
    } catch (err) {
      console.error(err);
      setError(err.response.data.message || err.message);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  const handleImgChange = (e) => {
    const file = e.target.files?.[0]
    console.log(file);
    if (file) {
      resizer.imageFileResizer(
        file,
        400,
        400,
        "JPEG",
        80,
        0,
        (uri) => {
          setProfileImgBase64(uri);
        },
        "base64"
      );
    } else {
      console.log('object');
      setProfileImgBase64(currentUser.img || "default-pfp.jpg");
    }
  }

  useEffect(() => {
    console.log(profileImgBase64);
  }, [profileImgBase64])

  return (
    <div className="edit-profile">
      <h1 className="modal-centered">Edit Profile</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        {error ? <p className="error-message">{error}</p> : ""}
        <div className="profile-img-wrapper">
          <img src={profileImgBase64 || currentUser.img || "default-pfp.jpg"} alt="profile picture" className="profile-img" />
          <input type="file" accept="image/*" id="file" onChange={handleImgChange} />
          <label htmlFor="file"><MdPhotoCamera /></label>
        </div>
        <input
          ref={fullnameRef}
          type="text"
          name="fullname"
          id="input-fullname"
          placeholder="Display Name"
        />
        <input
          ref={usernameRef}
          type="text"
          name="username"
          id="input-username"
          placeholder="Username"
        />
        <input
          ref={bioRef}
          type="text"
          name="bio"
          id="input-bio"
          placeholder="Bio"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          id="input-password"
          placeholder="Current password"
          required
        />
        <button type="submit" disabled={password === ""}>Save</button>
      </form>
    </div>
  );
}
