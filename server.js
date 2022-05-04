const WebSocket = require('ws');

const server = new WebSocket.Server({
    port:3000
}, ()=>{console.log('server is up and running.')})


server.on('connection', (socket, req)=>{
    socket.send("ehm")
})