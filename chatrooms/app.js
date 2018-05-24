const app = require('express')()
const http = require('http').Server(app)
const fs = require('fs')
const io = require('socket.io')(http);
const mime = require('mime')

app.get('/', (req, res) => {
  fs.readFile('public/index.html', 'utf-8', (err, data) => {
    res.writeHead(200, {'Content-type': 'text/html'})
    res.write(data)
    res.end()
  })
})

app.get('/stylesheet/style.css', (req, res) => {
  fs.readFile('public/stylesheet/style.css', 'utf-8', (err, data) => {
    res.writeHead(200, {'Content-type': 'text/css'})
    res.write(data)
    res.end()
  })
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('join', (msg)=>{
    io.sockets.in('Default').emit('reception', 'no_name is joined<br>')
    socket.join('Default')
  })
  socket.on('message', (data)=>{
    console.log(data)
    io.sockets.in(data.room).emit('reception', data.name + ': ' + data.msg + '<br>')
  })
  socket.on('name', (data)=>{
    console.log(data)
    socket.broadcast.to(data.room).emit('reception', data.oldname + ' is now known as ' + data.newname + '<br>')
  })
  socket.on('room', (data)=>{
    console.log(data)
    socket.join(data.room, ()=>{
      socket.leave(data.oldroom, ()=>{
        socket.broadcast.to(data.room).emit('reception', data.name + ' is joined<br>')
      })
    })
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000')
})
