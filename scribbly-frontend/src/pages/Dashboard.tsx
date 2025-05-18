import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Link2, LogOut, PenLine } from "lucide-react";
import background from "../assets/background.jpeg";

const Dashboard = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleLogout = () => keycloak.logout();

  const handleCreate = () => {
    const sessionId = crypto.randomUUID().slice(0, 8);
    navigate(`/whiteboard/${sessionId}`);
  };

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = e.currentTarget.inviteCode.value.trim();
    if (code) navigate(`/whiteboard/${code}`);
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
      <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom shadow-sm bg-white">
        <h4 className="m-0 text-primary fw-bold">
          Scribbly <PenLine />
        </h4>
        <button
          className="btn btn-outline-danger btn-sm d-flex align-items-center fw-bold"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          &nbsp; Logout
        </button>
      </div>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div
          className="card shadow-sm p-4 border-0"
          style={{ width: "100%", maxWidth: "480px", borderRadius: "1rem" }}
        >
          <h5 className="text-center mb-4 text-dark">
            Welcome,{" "}
            <strong>{keycloak.tokenParsed?.preferred_username}!</strong>
          </h5>

          <button
            className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center"
            onClick={handleCreate}
          >
            <PlusCircle size={18} />
            &nbsp; Create New Whiteboard
          </button>

          <form onSubmit={handleJoin}>
            <div className="input-group">
              <input
                type="text"
                name="inviteCode"
                className="form-control"
                placeholder="Enter Invite Code"
                required
              />
              <button
                className="btn btn-success d-flex align-items-center"
                type="submit"
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
