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

global.joinRoomWithToken = async function (joinType, token) {
    const method = `${joinType[0].toUpperCase()}${joinType.slice(1)}ModeSession`
    // 初始化一个房间 Session 对象, 这里使用 Stream 模式
    const myRoom = new QNRTC[method]
    // 这里替换成刚刚生成的 RoomToken
    await myRoom.joinRoomWithToken(token)

    return myRoom
}

/*
function genJwtToken() {
    const token = jsonwebtoken.sign({ foo: 'bar' }, 'ssssss')
    return token
}

// @todo 自定义子协议
const ws_protocols = []

const ws = new WebSocket(ws_url, ws_protocols)
console.log(ws)

//events: open, message, error, close

ws.addEventListener('open', event => {

    // 授权
    const auth_content = {
        action: 'auth',
        type: 'jwt',
        token: genJwtToken()
    }
    ws.send(JSON.stringify(auth_content))
})

ws.addEventListener('message', event => {
    console.log(event.data)
})

ws.addEventListener('close', () => {
    console.log('websocket close')
})

let n = 0
let timer = setInterval(() => {
    console.log('interval:' + n)
    if (n === 20) {
        console.log('interval end')
        clearInterval(timer)
    } else {
        ws.send('ping')
        n++
    }
}, 500)
*/
