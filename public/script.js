const socket = io('/');

const videoGrid = document.getElementById('video-container');

const myPeer = new Peer(undefined,{
    host: '/',
    port: '3001'
});

const peers = { }; // ←

const addVideo = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.appendChild(video);
}

const video = document.createElement('video'); // ←
video.muted = true;

navigator.mediaDevices.getUserMedia({
    video: video,
    audio: true,
}).then(stream => {
    addVideo(myVideo, stream)

    myPeer.on("call", call => {
       call.answer(stream) 

       call.on("stream", userVideoStream =>{
           addVideo(video,userVideoStream)
       })
    })
    
    socket.on('user-connected', userId => {
        connectToNewUser(userId,stream);
    });
})

socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close();
})

myPeer.on('open',id => {
    socket.emit('join-room', ROOM_ID, 10);
})

const connectToNewUser = (userID, stream) => {
    const call = myPeer.call(userID, stream);
    call.on('stream', userVideoStream => {
        addVideo(video,userVideoStream)
    });
    call.on('close', () => {
        video.remove();
    })

    peers[userId] = call;
};

socket.on('user-connected', userId => {
    console.log('user connected: ', userId);
});
