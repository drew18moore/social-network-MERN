import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CONFIRMATION_PHRASE = "delete my account";

const DeleteAccount = () => {
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const validate = () => {
    return (
      confirmationPhrase === CONFIRMATION_PHRASE && confirmPassword.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosPrivate.delete(`api/users/delete/${currentUser._id}`, {
        data: { password: confirmPassword },
      });
      navigate("/login");
    } catch (err: any) {
      setError(
        typeof err.response?.data?.message === "string"
          ? err.response?.data?.message
          : err.message
      );
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
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
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>
          <p>
            Type <i>delete my account</i> to confirm:
          </p>
          <input
            type="text"
            onChange={(e) => setConfirmationPhrase(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        <label>
          <p>Enter your password</p>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="new-password"
          />
        </label>
        <button disabled={!validate()}>Delete this account</button>
      </form>
    </div>
  );
};

export default DeleteAccount;
