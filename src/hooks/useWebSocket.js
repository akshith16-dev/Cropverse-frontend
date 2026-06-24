import { useEffect, useRef, useState } from "react";

const socketBase = () => {
  const defaultApiUrl = import.meta.env.DEV
    ? "http://127.0.0.1:8000"
    : "https://cropverse-backend.onrender.com";
  const apiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;
  return apiUrl.replace(/^http/, "ws").replace(/\/$/, "");
};

/** Reconnecting WebSocket hook for low-frequency dashboard events. */
export default function useWebSocket(path, onMessage) {
  const callback = useRef(onMessage);
  const [status, setStatus] = useState("connecting");
  useEffect(() => { callback.current = onMessage; }, [onMessage]);

  useEffect(() => {
    if (!path) return undefined;
    let socket;
    let retry;
    let stopped = false;
    let retryDelay = 3000;
    const connect = () => {
      setStatus("connecting");
      socket = new WebSocket(`${socketBase()}${path}`);
      socket.onopen = () => {
        retryDelay = 3000;
        setStatus("connected");
        socket.send("connected");
      };
      socket.onmessage = (event) => {
        try {
          callback.current?.(JSON.parse(event.data));
        } catch {
          /* ignore malformed events */
        }
      };
      socket.onclose = () => {
        setStatus("disconnected");
        if (!stopped) {
          retry = window.setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 2, 30000);
        }
      };
      socket.onerror = () => socket.close();
    };
    connect();
    return () => { stopped = true; window.clearTimeout(retry); socket?.close(); };
  }, [path]);
  return status;
}
