import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Link2, PenLine } from "lucide-react";
import background from "../assets/background.jpeg";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!username.trim()) return alert("Please enter a username");
    const sessionId = crypto.randomUUID().slice(0, 8);
    navigate(`/whiteboard/${sessionId}`, { state: { username } });
  };

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter a username");
    const code = e.currentTarget.inviteCode.value.trim();
    if (code) {
      navigate(`/whiteboard/${code}`, { state: { username } });
    }
  };

  return (
    <div
      className="vh-100 d-flex flex-column bg-light"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-bottom shadow-sm bg-white d-flex justify-content-center">
        <h4 className="m-0 text-primary fw-bold d-flex align-items-center gap-2">
          <PenLine /> Scribbly
        </h4>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div
          className="card shadow-lg p-5 border-0"
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Title + Tagline */}
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary mb-1">Welcome to Scribbly</h3>
            <p className="text-muted mb-0">Collaborate. Create. Communicate.</p>
          </div>

          {/* Username Input */}
          <input
            type="text"
            className="form-control form-control-lg mb-4"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ borderRadius: "0.5rem" }}
          />

          {/* Create Button */}
          <button
            className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center fw-semibold"
            onClick={handleCreate}
            style={{ borderRadius: "0.5rem" }}
          >
            <PlusCircle size={18} />
            &nbsp; Create New Whiteboard
          </button>

          {/* OR Divider */}
          <div className="text-center text-muted my-3">
            <small>— or join an existing board —</small>
          </div>

          {/* Join Form */}
          <form onSubmit={handleJoin}>
            <div className="input-group">
              <input
                type="text"
                name="inviteCode"
                className="form-control"
                placeholder="Enter Invite Code"
                required
                style={{ borderRadius: "0.5rem 0 0 0.5rem" }}
              />
              <button
                className="btn btn-success d-flex align-items-center fw-semibold"
                type="submit"
                style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
              >
                <Link2 size={16} />
                &nbsp; Join
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
