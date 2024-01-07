import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { MdPhotoCamera } from "react-icons/md";
import Resizer from "react-image-file-resizer";
import useEditProfile from "../../hooks/auth/useEditProfile";
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;

type Props = {
  setUser: React.Dispatch<React.SetStateAction<ProfileUser>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function EditProfile({ setUser, setShowModal }: Props) {
  const [profileImgBase64, setProfileImgBase64] = useState("");
  const displayNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");

  const { currentUser } = useAuth();

  const { editProfile, error } = useEditProfile({ setUser, setShowModal });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editProfile({
      displayName:
        displayNameRef?.current?.value.trim() || currentUser.fullname,
      username:
        usernameRef?.current?.value.trim().toLowerCase() ||
        currentUser.username,
      bio: bioRef?.current?.value.trim() || currentUser.bio,
      img: profileImgBase64 || currentUser.img!,
      password: password,
    });
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
          setProfileImgBase64(uri as string);
        },
        "base64"
      );
    } else {
      console.log("object");
      setProfileImgBase64(currentUser.img || "default-pfp.jpg");
    }
  };

  useEffect(() => {
    console.log(profileImgBase64);
  }, [profileImgBase64]);

  return (
    <div className="edit-profile">
      <h1 className="modal-centered">Edit Profile</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        {error ? <p className="error-message">{error}</p> : ""}
        <div className="profile-img-wrapper">
          <img
            src={profileImgBase64 || currentUser.img || "default-pfp.jpg"}
            alt="profile picture"
            className="profile-img"
          />
          <input
            type="file"
            accept="image/*"
            id="file"
            onChange={handleImgChange}
          />
          <label htmlFor="file">
            <MdPhotoCamera />
          </label>
        </div>
        <input
          ref={displayNameRef}
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
        <button type="submit" disabled={password === ""}>
          Save
        </button>
      </form>
    </div>
  );
}
