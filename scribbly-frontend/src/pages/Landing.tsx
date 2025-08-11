import { useNavigate } from "react-router-dom";
import scribblyLogo from "../assets/scribbly.png";
import landingbackground from "../assets/landing-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex vh-100 vw-100"
      style={{
        backgroundImage: `url(${landingbackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left Half */}
      <div className="w-50 d-flex flex-column justify-content-center align-items-center p-4 text-center">
        <h1 className="display-3 fw-bolder">
          Welcome to <span className="fw-bold text-primary">Scribbly!</span>
        </h1>
        <p className="lead mb-4">A Space to Collaborate, Create, Communicate.</p>

        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-primary btn-lg fw-semibold"
        >
          Get Started
        </button>
      </div>

      {/* Right Half */}
      <div className="w-50 d-flex justify-content-center align-items-center p-4">
        <img
          src={scribblyLogo}
          alt="Scribbly Whiteboard"
          className="img-fluid rounded shadow"
          style={{ maxHeight: "90%", maxWidth: "90%" }}
        />
      </div>
    </div>
  );
};

export default Landing;
