import { useKeycloak } from "@react-keycloak/web";
import scribblyLogo from "../assets/scribbly.png";
import landingbackground from "../assets/landing-bg.jpg";
import { LogIn, UserPlus } from "lucide-react";
const Landing = () => {
  const { keycloak } = useKeycloak();

  return (
    <div className="d-flex vh-100 vw-100"
    style={{
        backgroundImage: `url(${landingbackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      {/* Left Half */}
      <div className="w-50 d-flex flex-column justify-content-center align-items-center p-4 text-center">
        <h1 className="display-3 fw-bolder">
          Welcome to <span className="fw-bold text-primary">Scribbly!</span>
        </h1>

        <p className="lead mb-4">
          A Space to Collaborate, Create, Communicate.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3">
            <button 
              onClick={() => keycloak.login()}
              className="btn btn-primary btn-lg px-4 py-3 d-flex align-items-center justify-content-center fw-bold"
            >
              <LogIn className="me-2" size={20} />
              Get Started
            </button>
            <button
              onClick={() => keycloak.register()}
              className="btn btn-outline-light btn-lg px-4 py-3 d-flex btn-secondary align-items-center justify-content-center fw-bold"
            >
              <UserPlus className="me-2" size={20} />
              Create Account
            </button>
          </div>
      </div>

      {/* Right Half */}
      <div className="w-50 d-flex justify-content-center align-items-center p-4">
        {/* Replace the src below with your actual screenshot */}
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
