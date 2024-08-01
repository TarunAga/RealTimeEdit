const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const{ mongoose }= require('mongoose');
const cookieParser = require('cookie-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");

// const io = require('socket.io')(8001, {
//   cors: {
//     origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
//     methods: ["GET", "POST"]
//   }
// });
// io.on("connection", socket =>{
//   socket.on("send-changes", delta => {
//     socket.broadcast.emit("receive-changes", delta);
//   });
//   console.log("connected");
// })
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));


mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('DB connected');
}).catch((err) => {
  console.log(err);
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

const port = 8000;

app.use('/',require('./routes/authRoutes'));


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      // origin: process.env.REACT_APP_FRONTEND_URL,
      // credentials: true
    }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
            // socket.to(room).emit('userJoined', `A new user has joined the room: ${room}`);
          });

          socket.on('msg',({ data, roomId }) => {    
            console.log(roomId, data);
            socket.broadcast.to(roomId).emit('bcast', data);
          });
      
        socket.on('disconnect', () => {
        //   console.log('User disconnected');
        });
});
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
