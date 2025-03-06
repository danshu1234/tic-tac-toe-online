import express, { json, response } from "express"
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Socket from "./Socket.js";
import mongoose from "mongoose";

const app = express()
const server = createServer(app);

app.use(express.json())

app.use(cors({
origin: 'http://localhost:3000'
}));

mongoose.connect('mongodb+srv://danshu:TxqI0uFGnawY4OZB@sockets-id.mpgik.mongodb.net/?retryWrites=true&w=majority&appName=Sockets-id/blog')

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
  socket.on('inviteGame', ({ socketInput, socketId }) => {
    socket.to(socketInput).emit('invite', { socketId: socketId });
  })

  socket.on('updateGame', ({ friendSocket, jsonArr }) => {
    socket.to(friendSocket).emit('update', {jsonArr: jsonArr})
  })

  socket.on('exitGame', ({ friendSocket }) => {
    socket.to(friendSocket).emit('exit', {})
  })

  socket.on('exitApp', ({ socketConId }) => {
    io.emit('closeApp', {socketConId: socketConId})
  })

  socket.on('checkSocket', ({ mySocket, checkSocket }) => {
    const allSockets = io.sockets.sockets
    if (allSockets.has(checkSocket)) {
      io.to(mySocket).emit('resultCheck', {message: 'OK'})
    } else {
      io.to(mySocket).emit('resultCheck', {message: 'NO'})
    }
  })
});

app.post('/add/busy/user', async(req, res) => {
  const newBusyUser = new Socket({
    socketId: req.body.myInviteCode
  })
  await newBusyUser.save()
  res.json({response: 'Пользователь был успешно занят'})
})

app.post('/check/busy', async(req, res) => {
  const findBusyUser = await Socket.findOne({socketId: req.body.socketInput})
  if (findBusyUser === null) {
    res.json({response: 'OK'})
  } else {
    res.json({response: 'NO'})
  }
})

app.post('/delete/busy', async(req, res) => {
  await Socket.deleteMany({socketId: req.body.busySocket})
  res.json({response: 'Пользователь был успешно удален из занятых'})
})

server.listen(4444, (err) => {
if (err) {
console.log(err)
}
console.log('SERVER OK')
})