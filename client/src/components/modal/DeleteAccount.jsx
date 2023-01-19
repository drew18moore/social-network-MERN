import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const CONFIRMATION_PHRASE = "delete my account";

const DeleteAccount = () => {
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    return (
      confirmationPhrase === CONFIRMATION_PHRASE && confirmPassword.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.delete(`api/users/delete/${currentUser._id}`, {
        data: { password: confirmPassword },
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.log(err);
    }
  };
  return (
    <div className="delete-account-modal">
      <h1 className="modal-centered">Delete Account</h1>
      <hr />
      <p className="warning-text">
        You are about to <strong>permanently delete your account</strong>. This
        action <strong>cannot be undone</strong>.
      </p>
      {error && <p className="error-message">{error}</p>}
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
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button disabled={!validate()}>Delete this account</button>
      </form>
    </div>
  );
};

export default DeleteAccount;
