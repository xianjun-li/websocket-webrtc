// imports
// buildin
import Path from 'path'
// libs
import * as QNRTC from "pili-rtc-web"
import Vue from 'vue'
import vConsole from 'vconsole'
// import jsonwebtoken from 'jsonwebtoken'

import Client from 'websocket_jsonrpc/client'
global.WebSocketRpcClient = Client

// name binding to global
global.vConsole = vConsole
global.Vue = Vue
global.QNRTC = QNRTC

// config
global.sign_server_host = process.env.sign_server_host
global.auth_server_host = process.env.auth_server_host

const webSocketRpcClient = new WebSocketRpcClient()
global.webSocketRpcClient = webSocketRpcClient

// 检测客户端是否支持webrtc
global.detectWebRTC = function () {
    const WEBRTC_CONSTANTS = ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'];

    const isWebRTCSupported = WEBRTC_CONSTANTS.find((item) => {
        return item in window;
    })

    const isGetUserMediaSupported = navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

    if (!isWebRTCSupported || typeof isGetUserMediaSupported === 'undefined') {
        return false
    }

    return true
}

global.joinRoomWithToken = async function (joinType, token) {
    const sessionType = `${joinType[0].toUpperCase()}${joinType.slice(1)}ModeSession`
    // 初始化一个房间 Session 对象
    const myRoom = new QNRTC[sessionType]
    try {
        await myRoom.joinRoomWithToken(token)
        return myRoom
    } catch (error) {
        console.log(error)
        return null
    }
}