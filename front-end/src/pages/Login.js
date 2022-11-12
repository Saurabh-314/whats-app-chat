import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000");
const ENDPOINT = "https://what-app-server.herokuapp.com/auth";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "", password: ""
  })

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("submited form");
    const { email, password } = values;
    if (email !== "" && password !== "") {
      const { data } = await axios.post(`${ENDPOINT}/login`, values);
      // console.log("data", data);
      if (data.status) {
        // console.log(data.user);
        socket.emit("join_room", data.user);
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        // setShowChat(true)
        navigate("/");
      }
    }
  }
  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  return (
    <div className="joinChatContainer">
      <form onSubmit={submitHandler}>
        <h2>Login Chat</h2>
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
        <button>Login</button>
        <span>
          you have no account? &nbsp;<Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  )
}

export default Login