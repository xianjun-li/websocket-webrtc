'use strict'

/*  
media api:
    getUserMedia -> stream 获得视频
    MediaRecorder: 录制
    RTCPeerConnection 传输数据流
    RTCDataChannel 交换消息
*/

let video = document.getElementById('video')
let snap = document.getElementById('snap')

var context = canvas.getContext('2d');

// Trigger photo take
snap.addEventListener("click", function () {
    context.drawImage(video, 0, 0, 640, 480)
})

let constraints = {
    audio: true,
    video: {
        width: 1280,
        height: 720
    }
}

function getLocalMediaSuccess(stream) {
    window.stream = stream
    console.log(window.stream)
    video.srcObject = stream

    video.play()
}

function getLocalMediaError(error) {
    console.log(error.name + ": " + error.message)
}

navigator
    .mediaDevices
    .getUserMedia(constraints)
    .then(getLocalMediaSuccess)
    .catch(getLocalMediaError)