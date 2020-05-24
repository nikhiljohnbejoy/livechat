let Peer = require('simple-peer');
let socket = io();
const video = document.querySelector('video');
let client = {};

//get stream
navigator.mediaDevices.getUserMedia({video : true, audio : true})
.then(stream =>{
    socket.emit('NewClient');
    video.srcObject = stream;
    video.play();
    
    //Used to Initialize a Peer
    function InitPeer(type){
        console.log('Init Peer '+ type)
        let peer=new Peer({initiator : (type == 'init')?true:false, stream: stream, trickle: false})
        peer.on('stream',function(stream){
            CreateVideo(stream)
        })
        peer.on('close',function(){
            document.getElementById("peerVideo").remove();
            peer.destroy();
        })
        return peer;
    }
    //For Peer of type Init
    function MakePeer(){
        console.log('made peer')
        client.gotAnswer=false;
        let peer = InitPeer('init');
        peer.on('signal',function(data){
            if(!client.gotAnswer){
                socket.emit('Offer',data)
            }
        })
        client.peer=peer;
    }
    //For peer of type notInit
    function FrontAnswer(offer){
        console.log('FrontAnswer');
        let peer=InitPeer('notInit');
        peer.on('signal',(data)=>{
            socket.emit('Answer',data);
        })
        peer.signal(offer)
    }
    function SignalAnswer(answer){
        console.log('SignalAnswer');
        client.gotAnswer=true;
        let peer=client.peer;
        peer.signal(answer)
    }
    function CreateVideo(stream){
        console.log('createVideo');
        let video=document.createElement('video')
        video.id='peerVideo'
        video.srcObject=stream;
        video.className='embed-responsive-item'
        document.querySelector('#peerDiv').appendChild(video);
        video.play();
    }
    function sessionActive(){
        console.log('session active')
        document.write('Session Active. pls come back later');
    }
    socket.on('BackOffer', FrontAnswer)
    socket.on('BackAnswer', SignalAnswer)
    socket.on('SessionActive',sessionActive)
    socket.on('CreatePeer',MakePeer)

})
.catch(err => document.write(err));