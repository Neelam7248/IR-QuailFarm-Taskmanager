// simple socket client helper
import { io } from "socket.io-client";

// change URL if your server runs elsewhere
const URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export default socket;
