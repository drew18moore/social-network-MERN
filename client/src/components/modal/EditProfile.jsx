import React, { useRef } from "react";

export default function EditProfile() {
  const fullnameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  return (
    <div>
      <h1>Edit Profile</h1>
      <hr />
      <form>
        <input
          ref={fullnameRef}
          type="text"
          name="fullname"
          id="input-fullname"
          placeholder="Full Name"
        />
        <input
          ref={usernameRef}
          type="text"
          name="username"
          id="input-username"
          placeholder="Username"
        />
        <input
            ref={passwordRef}
            type="password"
            name="password"
            id="input-password"
            placeholder="Password"
            required
          />
          <button>Submit</button>
      </form>
    </div>
  );
}
