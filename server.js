var express = require('express');
var app = express();
const http =require('http').Server(app)

const io=require('socket.io')(http)
const port=process.env.PORT || 8080

app.use(express.static(__dirname+"/public"))
let clients = 0;

io.on('connection', function(socket){
    
    socket.on("NewClient", function(){
        console.log('con call')
        clients++;
        if(clients<3){

            if(clients == 2){
                console.log('emit peer')
                this.emit('CreatePeer')
            }
            console.log('con'+clients)
        }
        else{
            clients --;
            console.log('restrict')
            this.emit('SessionActive')
            this.disconnect();
        }
        
    })
    socket.on('Offer',SendOffer)

    socket.on('Answer',SendAnswer)

    socket.on('disconnect',Disconnect)
})


    function Disconnect(){
        console.log('dis call')
            if(clients>0&&clients<=2){
                this.broadcast.emit('Disconnect')
                console.log('dis'+clients)
            }
            if(clients>0)
                clients--
    }
    function SendOffer(offer){
        console.log('SendOffer')
        this.broadcast.emit('BackOffer',offer)
    }
    function SendAnswer(answer){
        console.log('SendAnswer')
        this.broadcast.emit('BackAnswer',answer)
    }


http.listen(port, () => console.log(`Active on ${port} port`))
/*var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(8080);*/