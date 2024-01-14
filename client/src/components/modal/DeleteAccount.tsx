import { useState } from "react";
import useDeleteAccount from "../../hooks/auth/useDeleteAccount";

const CONFIRMATION_PHRASE = "delete my account";

const DeleteAccount = () => {
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { deleteAccount, error } = useDeleteAccount();

  const validate = () => {
    return (
      confirmationPhrase === CONFIRMATION_PHRASE && confirmPassword.length > 0
    );
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
      <form
        onSubmit={() => deleteAccount({ password: confirmPassword })}
        autoComplete="off"
      >
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
