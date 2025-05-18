import { Undo, Redo, Eraser, MessageCircleX } from "lucide-react";
import { Socket } from "socket.io-client";
import { useEffect } from "react";

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

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>;
  socketRef: React.RefObject<Socket | null>;
  settings: { color: string; size: number };
  setSettings: (settings: { color: string; size: number }) => void;
  paths: Path[];
  setPaths: React.Dispatch<React.SetStateAction<Path[]>>;
  undos: Path[];
  setUndos: React.Dispatch<React.SetStateAction<Path[]>>;
  drawState: { active: boolean; path: Point[] };
  setDrawState: React.Dispatch<
    React.SetStateAction<{ active: boolean; path: Point[] }>
  >;
  cursors: { [id: string]: Cursor };
  redraw: () => void;
  username: string;
  clearBoard: () => void;
  clearChat: () => void;
}

const Canvas = ({
  canvasRef,
  ctxRef,
  socketRef,
  settings,
  setSettings,
  paths,
  setPaths,
  undos,
  setUndos,
  drawState,
  setDrawState,
  cursors,
  redraw,
  username,
  clearBoard,
  clearChat,
}: CanvasProps) => {
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawState({
      active: true,
      path: [{ x, y, color: settings.color, size: settings.size }],
    });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    socketRef.current?.emit("cursor", { x, y, username });

    if (!drawState.active) return;
    const last = drawState.path[drawState.path.length - 1];

    // Draw directly on the canvas
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = settings.color;
    ctx.lineWidth = settings.size;
    ctx.lineCap = "round";
    ctx.stroke();

    socketRef.current?.emit("draw", {
      x,
      y,
      prevX: last.x,
      prevY: last.y,
      color: settings.color,
      size: settings.size,
    });

    const newPoint = { x, y, color: settings.color, size: settings.size };
    setDrawState((prev) => ({
      ...prev,
      path: [...prev.path, newPoint],
    }));
  };

  const stopDrawing = () => {
    if (drawState.active && drawState.path.length > 1) {
      // Persist the current path to paths
      setPaths((prev) => [...prev, { points: drawState.path }]);
      setUndos([]);
    }
    setDrawState({ active: false, path: [] });
    // Redraw to include the newly persisted path
    redraw();
  };

  const undo = () => {
    const last = paths[paths.length - 1];
    if (!last) return;
    setPaths((prev) => prev.slice(0, -1));
    setUndos((prev) => [...prev, last]);
    redraw();
    socketRef.current?.emit("undo", {
      pathHistory: paths.slice(0, -1),
      undoHistory: [...undos, last],
    });
  };

  const redo = () => {
    const lastUndo = undos[undos.length - 1];
    if (!lastUndo) return;
    setUndos((prev) => prev.slice(0, -1));
    setPaths((prev) => [...prev, lastUndo]);
    redraw();
    socketRef.current?.emit("redo", {
      pathHistory: [...paths, lastUndo],
      undoHistory: undos.slice(0, -1),
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const { offsetWidth, offsetHeight } = canvas;
      canvas.width = offsetWidth;
      canvas.height = offsetHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
      }

      ctxRef.current = ctx;
      redraw(); // Redraw after resizing to restore the canvas state
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [canvasRef, ctxRef, redraw]); // Add redraw as a dependency

  return (
    <div
      style={{
        flexGrow: 1,
        minWidth: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block", // critical: removes extra padding
          width: "100%",
          height: "100%",
          border: "1px solid #ccc",
          cursor: "crosshair",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div
        className="d-flex gap-2 align-items-center px-3 py-2 rounded"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#e6e8ed",
          zIndex: 10,
        }}
      >
        <input
          type="color"
          value={settings.color}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSettings({ ...settings, color: e.target.value })
          }
          title="Pick a color"
        />
        <select
          className="form-select form-select-sm"
          style={{ width: "100px" }}
          value={settings.size}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSettings({ ...settings, size: Number(e.target.value) })
          }
          title="Brush size"
        >
          <option value={1}>1px</option>
          <option value={3}>3px</option>
          <option value={5}>5px</option>
          <option value={10}>10px</option>
        </select>
        <button
          className="btn btn-outline-secondary btn-sm fw-bold"
          onClick={undo}
        >
          <Undo /> Undo
        </button>
        <button
          className="btn btn-outline-secondary btn-sm fw-bold"
          onClick={redo}
        >
          <Redo /> Redo
        </button>
        <button
          title="Clear Whiteboard"
          className="btn btn-danger btn-sm fw-bold"
          onClick={clearBoard}
        >
          <Eraser size={20} strokeWidth={2} />
        </button>
        <button
          title="Clear Chat"
          className="btn btn-warning btn-sm fw-bold"
          onClick={clearChat}
        >
          <MessageCircleX size={20} strokeWidth={2} />
        </button>
      </div>
      {Object.entries(cursors).map(([id, cursor]) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: cursor.x,
            top: cursor.y,
            width: "10px",
            height: "10px",
            backgroundColor: "red",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "-10px",
              fontSize: "12px",
              color: "black",
              pointerEvents: "none",
            }}
          >
            {cursor.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Canvas;