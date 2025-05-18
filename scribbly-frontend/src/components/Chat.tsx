import { useEffect } from "react";
import { Socket } from "socket.io-client";

interface Message {
  username: string;
  message: string;
  timestamp: string;
}

interface ChatProps {
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  socketRef: React.RefObject<Socket | null>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatInput: string;
  setChatInput: (input: string) => void;
  username: string;
}

const Chat = ({
  chatContainerRef,
  socketRef,
  messages,
  setMessages,
  chatInput,
  setChatInput,
  username,
}: ChatProps) => {
  useEffect(() => {
    const chat = chatContainerRef.current;
    if (chat) chat.scrollTop = chat.scrollHeight;
  }, [messages, chatContainerRef]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const message = chatInput;
    const timestamp = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setMessages((prev) => [
      ...prev,
      { username, message, timestamp },
    ]);
    socketRef.current!.emit("message", { username, message });
    setChatInput("");
  };

  return (
    <div
      className="p-3 border-start bg-light"
      style={{
        minWidth: "250px",
        maxWidth: "400px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <h5 className="fw-bold">Live Chat</h5>
      <div
        ref={chatContainerRef}
        style={{
          border: "1px solid #ccc",
          height: "calc(100% - 120px)",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <small className="text-muted">{msg.timestamp} </small>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message"
        />
        <button
          className="btn btn-primary btn-sm fw-bold"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;