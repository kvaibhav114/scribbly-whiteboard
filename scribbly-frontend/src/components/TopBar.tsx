import { useState } from "react";
import { LogOut, Clipboard } from "lucide-react";
import blueBackground from "../assets/top-bar.jpg";

interface TopBarProps {
  sessionId: string | undefined;
  saveAsPDF: () => void;
  exitSession: () => void;
}

const TopBar = ({ sessionId, saveAsPDF, exitSession }: TopBarProps) => {
  const [copied, setCopied] = useState(false);

  const copySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div
      className="d-flex gap-3 align-items-center px-3 py-2 border-bottom bg-light justify-content-between"
      style={{
        backgroundImage: `url(${blueBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="d-flex align-items-center gap-1 text-white fw-bold">
        <em>Session: </em> {sessionId}
        <button
          className="btn btn-sm p-1 text-white"
          onClick={copySessionId}
          style={{ fontSize: "12px" }}
        >
          {copied ? "Copied" : <Clipboard size={20} strokeWidth={2}/>}
        </button>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-primary btn-sm fw-bold" onClick={saveAsPDF}>
          Save as PDF
        </button>
        <button className="btn btn-secondary btn-sm fw-bold" onClick={exitSession}>
          <LogOut /> Exit Session
        </button>
      </div>
    </div>
  );
};

export default TopBar;