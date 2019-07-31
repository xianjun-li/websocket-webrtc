// import jsonwebtoken from 'jsonwebtoken'

// import { TrackModeSession, deviceManager, version } from "pili-rtc-web"
import * as QNRTC from "pili-rtc-web"

const vConsole = require("vconsole")

// const vconsole = new vConsole()

// todo global var [QNRTC] <- webpack
global.QNRTC = QNRTC

global.ROOMTOKEN_1 = process.env.ROOMTOKEN_1
global.ROOMTOKEN_2 = process.env.ROOMTOKEN_2
global.ROOMTOKEN_3 = process.env.ROOMTOKEN_3
global.ROOMTOKEN_4 = process.env.ROOMTOKEN_4

global.getRoomToken = function (username, roomID) {
    switch (username) {
        case 'user1':
            return ROOMTOKEN_1;
        case 'user2':
            return ROOMTOKEN_2;
        case 'user3':
            return ROOMTOKEN_3;
        case 'user4':
            return ROOMTOKEN_4;
    }
}

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

const ws_url = 'ws://localhost:3000'

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

