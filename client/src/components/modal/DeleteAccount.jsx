import React, { useState } from "react";

const DeleteAccount = () => {
  const [confirmationPhrase, setConfirmationPhrase] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const handleSubmit = () => {};
  return (
    <div className="delete-account-modal">
      <h1 className="modal-centered">Delete Account</h1>
      <hr />
      <p className="warning-text">You are about to <strong>permanently delete your account</strong>. This action <strong>cannot be undone</strong>.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <p>
            Type <i>delete my account</i> below:
          </p>
          <input
            type="text"
            onChange={(e) => setConfirmationPhrase(e.target.value)}
            required
          />
        </label>

        <label>
          <p>Confirm your password</p>
          <input
            type="text"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button>Delete this account</button>
      </form>
    </div>
  );
};

export default DeleteAccount;
