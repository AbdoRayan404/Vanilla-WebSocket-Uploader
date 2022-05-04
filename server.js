const ws = require('ws');
const fs = require('fs');
const http = require('http');

const server = http.createServer()
const wserver = new ws.Server({noServer:true})

wserver.on('connection',(ws)=>{
    let fileName = ""
    ws.on('message',(data, isbinary)=>{
        if(isbinary == false){
            fileName = data.toString()
        }
        //when binary (file data)
        else{
            fs.appendFileSync(fileName,data)
        }
    })
})

//in case of upgrade (from HTTP -> WebSocket), emit the connection to the WS server.
server.on('upgrade',(request,socket,head)=>{
    //only accept upgrades in "/upload" path.
    if(request.url !== '/upload'){
        socket.end();
    }

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

    if(req.url === 'upload'){
        res.end('You may need to upgrade protocol to WebSocket.')
    }
})

server.listen(process.env.PORT || 3000)

/////////////////////////////////////
// that's just to make github make //
// the project JavaScript main     //
// and not HTML... Github really   //
// need help on this... it's so w- //
// weird that i need to add more l-//
// lines in order to make Github   //
// mark it as JavaScript project   //
// Sad... anyways i guess that's it//
/////////////////////////////////////