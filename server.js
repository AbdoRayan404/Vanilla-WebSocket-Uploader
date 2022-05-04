const ws = require('ws');
const fs = require('fs');
const http = require('http');

const server = http.createServer()
const wserver = new ws.Server({noServer:true})

wserver.on('connection',(ws)=>{
    ws.send("test.")
})

//in case of upgrade (from HTTP -> WebSocket), emit the connection to the WS server.
server.on('upgrade',(request,socket,head)=>{
    wserver.handleUpgrade(request,socket,head, (ws)=>{
        wserver.emit('connection', ws, request)
    })
})

//in case of Request (HTTP) Act like a normal HTTP server.
server.on('request',(req,res)=>{
    if(req.url === '/'){
        res.end(fs.readFileSync('./src/index.html'))
        return;
    }
})

server.listen(process.env.PORT || 3000)