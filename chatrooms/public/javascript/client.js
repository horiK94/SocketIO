$(() => {
  const socket = io()
  console.log("hogehoge")
  $('#send-form').submit(()=>{
    console.log('message send: ' + $('#send-message').val())
    socket.emit('message send', $('#send-message').val())
    $('#send-message').val('')
    return false
  })
  socket.on('message send', (msg) => {
    $('#messages').append(msg)
  })
})
