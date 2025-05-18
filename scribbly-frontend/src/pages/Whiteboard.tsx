import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { io, Socket } from "socket.io-client";
import { jsPDF } from "jspdf";
import TopBar from "../components/TopBar";
import Canvas from "../components/CanvasArea";
import Chat from "../components/Chat";

interface Point {
  x: number;
  y: number;
  color: string;
  size: number;
}

interface Path {
  points: Point[];
}

interface Cursor {
  x: number;
  y: number;
  username: string;
}

interface DrawEvent {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  color: string;
  size: number;
}

interface HistoryEvent {
  pathHistory: Path[];
  undoHistory: Path[];
}

interface MessageEvent {
  username: string;
  message: string;
}

interface CursorEvent {
  id: string;
  x: number;
  y: number;
  username: string;
}

const Whiteboard = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState({ color: "#000000", size: 3 });
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { username: string; message: string; timestamp: string }[]
  >([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [undos, setUndos] = useState<Path[]>([]);
  const [drawState, setDrawState] = useState({
    active: false,
    path: [] as Point[],
  });
  const [cursors, setCursors] = useState<{ [id: string]: Cursor }>({});

  useEffect(() => {
    if (initialized && !keycloak.authenticated) navigate("/");
  }, [initialized, keycloak, navigate]);

  useEffect(() => {
    if (!initialized || !keycloak.authenticated || !keycloak.token) return;

    const username = keycloak.tokenParsed?.preferred_username || "Anonymous";
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth - 400;
    canvas.height = window.innerHeight - 60;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const socket = io("http://localhost:5000", {
      auth: { token: keycloak.token, username, sessionId },
    });
    socketRef.current = socket;

    socket.on("draw", (data: DrawEvent) => {
      // Skip if this is the local user's own event
      const { x, y, prevX, prevY, color, size } = data;
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.stroke();

      // Update paths for remote users
      setPaths((prev) => {
        const last = prev[prev.length - 1];
        const newPoint = { x, y, color, size };
        if (
          last &&
          last.points[last.points.length - 1].x === prevX &&
          last.points[last.points.length - 1].y === prevY
        ) {
          return [...prev.slice(0, -1), { points: [...last.points, newPoint] }];
        }
        return [
          ...prev,
          { points: [{ x: prevX, y: prevY, color, size }, newPoint] },
        ];
      });
    });

    socket.on("clear-whiteboard", () => {
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setPaths([]);
      setUndos([]);
      redraw();
    });

    socket.on("undo", (data: HistoryEvent) => {
      setPaths(data.pathHistory);
      setUndos(data.undoHistory);
      redraw();
    });

    socket.on("redo", (data: HistoryEvent) => {
      setPaths(data.pathHistory);
      setUndos(data.undoHistory);
      redraw();
    });

    socket.on("message", (data: MessageEvent) => {
      const { username, message } = data;
      const timestamp = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setMessages((prev) => [...prev, { username, message, timestamp }]);
    });

    socket.on("clear-chat", () => setMessages([]));

    socket.on("cursor", (data: CursorEvent) => {
      const { id, x, y, username } = data;
      setCursors((prev) => ({ ...prev, [id]: { x, y, username } }));
    });

    socket.on("user-disconnected", (id: string) => {
      setCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[id];
        return newCursors;
      });
    });

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth - 400;
      canvas.height = window.innerHeight - 60;
      redraw();
    };
    window.addEventListener("resize", handleResize);

    socket.on("connect_error", (err: Error) => {
      console.error("Connection error:", err);
      alert("Cannot connect to server. Please try again.");
    });

    return () => {
      socket.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [initialized, keycloak, sessionId]);

  const redraw = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;

    // Only clear the canvas if we're not actively drawing
    if (!drawState.active) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Draw all persisted paths
    paths.forEach((path) => {
      const points = path.points;
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = points[0].color;
      ctx.lineWidth = points[0].size;
      ctx.lineCap = "round";
      ctx.stroke();
    });

    // Draw the current path being drawn (if any)
    if (drawState.active && drawState.path.length >= 2) {
      const points = drawState.path;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = points[0].color;
      ctx.lineWidth = points[0].size;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  useEffect(() => {
    redraw();
  }, [paths]);

  const clearBoard = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPaths([]);
    setUndos([]);
    setDrawState({ active: false, path: [] });
    socketRef.current?.emit("clear-whiteboard");
  };

  const clearChat = () => {
    setMessages([]);
    socketRef.current?.emit("clear-chat");
  };

  const exitSession = () => navigate("/dashboard");

  const saveAsPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("whiteboard.pdf");
  };

  if (!initialized) return <div>Loading...</div>;

  const username = keycloak.tokenParsed?.preferred_username || "Anonymous";

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <TopBar
        sessionId={sessionId}
        saveAsPDF={saveAsPDF}
        exitSession={exitSession}
      />
      <div
        className="d-flex"
        style={{
          width: "100vw",
          height: "100vh", // Full screen
          overflow: "hidden",
        }}
      >
        <Canvas
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          socketRef={socketRef}
          settings={settings}
          setSettings={setSettings}
          paths={paths}
          setPaths={setPaths}
          undos={undos}
          setUndos={setUndos}
          drawState={drawState}
          setDrawState={setDrawState}
          cursors={cursors}
          redraw={redraw}
          username={username}
          clearBoard={clearBoard}
          clearChat={clearChat}
        />
        <Chat
          chatContainerRef={chatContainerRef}
          socketRef={socketRef}
          messages={messages}
          setMessages={setMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          username={username}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
