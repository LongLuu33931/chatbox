import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
const connect = process.env.REACT_APP_CONNECT || "http://localhost:3001";
console.log(connect);
const socket = io.connect(connect);

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Trò Chuyện</h3>
          <input
            type="text"
            placeholder="Tên của bạn..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Mã Phòng..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Vào Phòng</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
