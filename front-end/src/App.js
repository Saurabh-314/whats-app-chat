import { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client'
import Chat from './Chat';
import Login from './component/Login';

const socket = io.connect("http://localhost:5000");

const App = () => {
  const [userData, setUserData] = useState();
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('chat-app-user');
    console.log("user logged", user)
    if (user) {
      setShowChat(true);
      const userInfo = {
        id: user.id,
        user: user.user
      }
      socket.emit("join_room", user);
      setUserData(userInfo)
    }
  }, [])

  return (
    <div className="App">
      {!showChat ? (
        <Login socket={socket} setUserData={setUserData} setShowChat={setShowChat} />
      ) : (
        <Chat socket={socket} userData={userData} />
      )}
    </div>
  );
}

export default App;
