import { useNavigate } from "react-router-dom";
import "./connect.css";

const Connect = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="connect-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <p>Connect</p>
      </div>
      <h1 className="connect-h1">People you may know</h1>
    </>
  );
};

export default Connect;
