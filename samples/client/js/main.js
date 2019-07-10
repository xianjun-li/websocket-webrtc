'use strict'

/*  
media api:
    getUserMedia -> stream 获得视频
    MediaRecorder: 录制
    RTCPeerConnection 传输数据流
    RTCDataChannel 交换消息
*/


// view elements:

const localVideo = document.getElementById('localVideo')
const remoteVideo = document.getElementById('remoteVideo')
const context = canvas.getContext('2d');

const startButton = document.getElementById('startButton')
const callButton = document.getElementById('callButton')
const hangupButton = document.getElementById('hangupButton')
const snap = document.getElementById('snap')

callButton.disabled = true
hangupButton.disabled = true


// Trigger photo take
snap.addEventListener("click", function () {
    context.drawImage(localVideo, 0, 0, 640, 480)
})







let constraints = {
    audio: true,
    video: {
        width: 1280,
        height: 720
    }
}

let localStream
let remoteStream

let localPeerConnection
let remotePeerConnection

function getLocalMediaStream(stream) {
    localStream = stream
    localVideo.srcObject = localStream
}

function handleMediaStreamError(error) {
    console.log(`getUserMedia error: ${error.toString()}`)
}

function getRemoteMediaStream(event) {
    const stream = event.stream
    remoteVideo.srcObject = stream
}

function getOtherPeer(peerConnection) {
    return peerConnection === localPeerConnection ?
        remotePeerConnection : localPeerConnection
}


function handleConnection(event) {
    const peerConnection = event.target
    const iceCandidate = event.candidate

    if (iceCandidate) {
        const newIceCandidate = new RTCIceCandidate(iceCandidate)
        const otherPeer = getOtherPeer(peerConnection)

        otherPeer.addIceCandidate(newIceCandidate)
            .then(() => {
                //
            }).catch(error => {
                //
            })
    }
}

function startAction() {

    startButton.disabled = true
    navigator
        .mediaDevices
        .getUserMedia(constraints)
        .then(getLocalMediaStream)
        .then(() => {
            callButton.disabled = false
        })
        .catch(handleMediaStreamError)
}

// function setLocalDescription(peerConnection) {
//     setDescriptionSucess(peerConnection, 'setLocalDescription')
// }

function createAnswer(description) {
    remotePeerConnection.setLocalDescription(description)
        .then(() => { }).catch(() => { })
    localPeerConnection.setRemoteDescription(description)
        .then(() => { }).catch(() => { })
}

function createdOffer(description) {

    // localPeerConnection.setLocalDescription(description)
    //     .then(() => {
    //         setLocalDescriptionSuccess(localPeerConnection)
    //     }).catch(() => { })

    // remotePeerConnection.setLocalDescription(description)
    //     .then(() => {
    //         setRemoteDescriptionSuccess(remotePeerConnection)
    //     }).catch(() => { })

    remotePeerConnection.createAnswer()
        .then(createdAnswer)
        .catch(() => { })
}

function handleConnectionChange(event) {
    
}

function callAction() {
    callButton.disabled = true
    hangupButton.disabled = false

    const videoTracks = localStream.getVideoTracks()
    const audioTracks = localStream.getAudioTracks()

    const servers = null

    localPeerConnection = new RTCPeerConnection(servers)

    localPeerConnection.addEventListener('icecandidate', handleConnection)
 localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange)


    remotePeerConnection = new RTCPeerConnection(servers)

    remotePeerConnection.addEventListener('icecandate', handleConnection)

    localPeerConnection.addEventListener('addstream', getRemoteMediaStream)

    localPeerConnection.addEventListener('addstream', getRemoteMediaStream)

    localPeerConnection.addStream(localStream)

    const offerOptions = {
        offerToReceiveVideo: 1
    }


    localPeerConnection.createOffer(offerOptions).then(createdOffer).catch()

}

// binding event

startButton.addEventListener('click', startAction)
callButton.addEventListener('click', callAction)