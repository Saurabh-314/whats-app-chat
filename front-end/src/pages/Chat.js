import React, { useState, useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import axios from "axios";
import { useNavigate } from "react-router-dom";

import io from 'socket.io-client'
const socket = io.connect("http://localhost:5000");
const ENDPOINT = "https://what-app-server.herokuapp.com/auth";

const Chat = () => {
  const navigate = useNavigate();
  // const { socket } = props
  const [id, setId] = useState("");
  const [user, setUser] = useState("");
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(users[0]);


  const getAllUser = async (id) => {
    // console.log("getAllUser",id)
    // console.log("ids", id)
    const { data } = await axios.get(`${ENDPOINT}/allusers/${id}`);
    // console.log("fetch all user", data.users);
    setUsers(data.users)
  }

  const getMessage = async () => {
    // console.log("id", id)
    const { data } = await axios.get(`${ENDPOINT}/getmsg`);
    // console.log("get Message", data.message);
    if (data.message) {
      setMessageList((list) => [...list, ...data.message])
    }
  }


  useEffect(() => {
    const loggedUser = localStorage.getItem('chat-app-user');
    if (loggedUser) {
      // console.log(loggedUser);
      const data = JSON.parse(loggedUser);
      // console.log("data",data);
      socket.emit("join_room", data);
      setId(data.id);
      setUser(data.user);
      getAllUser(data.id);
      getMessage();
    } else {
      navigate("/login");
    }
  }, [])

  useEffect(() => {
    const handler = (data) => {
      // console.log("handler", data);
      setMessageList((list) => [...list, data])
    };
    socket.on('receive_message', handler)
    return () => socket.off('receive_message', handler);
  }, [])

  const currUserFun = (data) => {
    // console.log("selected user", data);
    setSelectedUser(data)
    // getMessage(id, data._id);
  }


  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        to: selectedUser._id,
        from: id,
        author: user,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }
      setMessageList((list) => [...list, messageData])
      setCurrentMessage("")
      await socket.emit('send_message', messageData);
      await axios.post(`${ENDPOINT}/addmsg`, messageData);
    }
  }


  return (
    <>
      {/* <Contacts users={users} currUserFun={currUserFun} /> */}
      <div className='contact-container'>
        <div className="contact-header">
          <div className="username">{user}</div>
        </div>
        <div className="contact-list">
          {
            users && users.map((list) => {
              return (
                <div
                  className="list"
                  key={list._id}
                  id={list._id}
                  onClick={() => currUserFun(list)}
                >
                  {list.username}
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <p>{selectedUser && selectedUser.username}</p>
        </div>
        <div className="chat-body">
          {
            (selectedUser && id) ?
              (
                <ScrollToBottom className="message-container">
                  {
                    messageList.map((messageContent, i) => {
                      if (messageContent.to === selectedUser._id || messageContent.from === selectedUser._id) {
                        return (
                          <div
                            className="message"
                            id={user !== messageContent.author ? "you" : "other"}
                            key={i}
                          >
                            <div>
                              <div className="message-content">
                                <p>{messageContent.message}</p>
                              </div>
                              <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
                </ScrollToBottom>
              )
              :
              (
                <div>select contact list</div>
              )
          }

        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Hi..."
            onChange={(e) => {
              setCurrentMessage(e.target.value)
            }}
            onKeyPress={(e) => {
              e.key === "Enter" && sendMessage()
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    </>
  )
}

export default Chat