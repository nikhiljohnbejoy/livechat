var express = require('express');
var app = express();
const http =require('http').Server(app)

const io=require('socket.io')(http)
const port=process.env.PORT || 8080

app.use(express.static(__dirname+"/public"))
let clients = 0;

io.on('connection', function(socket){
    
    socket.on("NewClient", function(){
        
        if(clients==0){
            clients++;
        }
           else if(clients == 1){
                console.log('emit peer')
                this.emit('CreatePeer')
            }
                
            
        }
        else{
            console.log('restrict')
            this.emit('SessionActive')
        }
        
        console.log('con'+clients)
    })
    socket.on('Offer',SendOffer)

    socket.on('Answer',SendAnswer)

    socket.on('disconnect',Disconnect)
})


    function Disconnect(){
        if(clients > 0)
        clients--;
        
        console.log('dis'+clients)
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