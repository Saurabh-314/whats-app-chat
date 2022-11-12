import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000");

const ENDPOINT = "https://what-app-server.herokuapp.com/auth";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "", email: "", password: ""
  })

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("submited form");
    const { username, email, password } = values;
    if (username !== "" && email !== "" && password !== "") {
      const { data } = await axios.post(`${ENDPOINT}/register`, values);
      // console.log("data", data);
      if (data.status === true) {
        // setUserData(data.user);
        socket.emit("join_room", data.user);
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate("/");
      }
    }
  }
  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  return (
    <div className="regChatContainer">
      <form onSubmit={submitHandler}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          name="username"
          onChange={changeHandler}
        />
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
        <button>Register</button>
        <span>
          you have no account? &nbsp;<Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  )
}

export default Register