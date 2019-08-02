
const UrlParser = require('url')
const EventEmitter = require('events')
// http server lib
const Koa = require('koa')
// websocket server lib
const WebSocket = require('ws')

function isJSON(str) {
    return new Promise(
        (resolve, reject) => resolve(JSON.parse(str))
    )
}

const eventEmitter = new EventEmitter()
const koaApp = new Koa()
const httpServer = koaApp.listen(3000)
const wsServer = new WebSocket.Server({ server: httpServer })

const feaure = {
    auth: true
}

// koaApp.use(async ctx => {
//     ctx.body = 'hello world'
// })

// req : http.IncomingMessage
wsServer.on('connection', (socket, req) => {

    // check req
    const url = req.url
    const url_info = UrlParser.parse(url, true)

    if (typeof url_info.query['token'] === 'undefined') {
        socket.terminate()
        return
    }

    const auth_token = url_info.query['token']

    const req_headers = req.headers

    // todo 检查 auth_token

    const ctx = {
        feaure,
        socket,
        req_headers,
        url_info,
        auth_token
    }

    eventEmitter.emit('socket.connection', ctx)

    socket.on('message', message => {
        eventEmitter.emit('socket.message', [ctx, message])
    })
})

// event handles
eventEmitter.on('socket.connection', ctx => {
    ctx.socket.send('connected')
})

// todo 心跳检测

// todo broadcast

eventEmitter.on('socket.message', ([ctx, message]) => {

    let req_type = null

    message = JSON.parse(message)

    if (typeof message.type !== 'undefined') {
        req_type = message.type
    } else {
        if (typeof message.action !== 'undefined') {
            req_type = 'action'
        }
    }

    if (req_type === 'action') {
        const action_name = message.action
        console.log(action_name)
        const data = typeof message.data !== 'undefined' ? message.data : {}

        eventEmitter.emit(action_name, { ctx, data })
    }
})

eventEmitter.on('getRoomToken', ({ ctx, data }) => {
    // todo
    ctx.socket.send('haha')
})
