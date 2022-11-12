const express = require('express');
const mongoose = require("mongoose");
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");

require("dotenv").config();
app.use(cors());

const PORT = process.env.PORT // production 
// const PORT = 5000 || process.env.PORT // development 

const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
// require("dotenv").config();

app.use("/", homeRoutes)
app.use("/auth", userRoutes);

const server = http.createServer(app);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("db connection successfully");
}).catch((err) => {
    console.log(err.message);
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
})

io.on("connection", (socket) => {
    console.log('User Connected', socket.id)

    socket.on("join_room", (data) => {
        // console.log("data", data);
        socket.join(data.id);
    })

    socket.on("send_message", (data) => {
        // console.log('this is action of send data', data)
        socket.to(data.to).emit("receive_message", data)
    })

    socket.on("disconnect", () => {
        console.log('User Disconected', socket.id)
    })
})

server.listen(PORT, () => {
    console.log('SERVER RUNNING ')
})