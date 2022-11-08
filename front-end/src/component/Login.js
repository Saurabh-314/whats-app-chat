import React from 'react'
import { useState } from 'react'
import axios from 'axios';

const Login = ({ socket, setUserData, joinRoom, setShowChat }) => {
  const [values, setValues] = useState({
    email: "", password: ""
  })
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("submited form");
    const { email, password } = values;
    if (email !== "" && password !== "") {
      const { data } = await axios.post("http://localhost:5000/auth/login", values);
      console.log("data", data);
      if (data.status) {
        setUserData(data.user);
        socket.emit("join_room", data.user);
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        setShowChat(true)
      }
    }
  }
  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  return (
    <div className="joinChatContainer">
      <h2>Join Chat</h2>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Email Id"
          name="email"
          onChange={changeHandler}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={changeHandler}
        />
        <button onClick={joinRoom}>Login</button>
      </form>
    </div>
  )
}

export default Login