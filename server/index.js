const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messageRoute");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log("DB CONNECTION SUCCESSFUL");
}).catch((err) => {
    console.log(err.message);
})

const server = app.listen(process.env.PORT, () => {
    console.log(`server started on PORT ${process.env.PORT}`);
});


const io = socket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});


global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            const message = {
                id: uuidv4(), // Generate a unique ID for the message
                message: data.message,
            };
            socket.to(sendUserSocket).emit("msg-recieve", message);
        }
    });
});

