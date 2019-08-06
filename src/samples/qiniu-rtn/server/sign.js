
const UrlParser = require('url')
const EventEmitter = require('events')
// http server lib
const Koa = require('koa')
// websocket server lib
const WebSocket = require('ws')
// qiniu sdk
const qiniu = require('qiniu')
const dotenv = require('dotenv')

function isJSON(str) {
    return new Promise(
        (resolve, reject) => resolve(JSON.parse(str))
    )
}

function response(socket, data, type) {
    if (typeof data === 'object') {
        data = JSON.stringify(data)
    }
    socket.send(data)
}

const eventEmitter = new EventEmitter()
const koaApp = new Koa()
const httpServer = koaApp.listen(3000)
const wsServer = new WebSocket.Server({ server: httpServer })


// config and setting
const _env_data = dotenv.config()
const env_data = _env_data.error ? {} : _env_data.parsed

console.log(env_data.rtn_app_id)

const feaure = {
    auth: true
}

const qiniu_ak = env_data.qiniu_ak
const qiniu_sk = env_data.qiniu_ak
const qiniu_credentials = new qiniu.Credentials(qiniu_ak, qiniu_sk)

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
    // app info
    const app_info = {
        app_id: env_data.rtn_app_id
    }
    ctx.socket.send(JSON.stringify(app_info))
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
    } else {
        ctx.socket.send('pong')
    }
})

eventEmitter.on('getRoomToken', ({ ctx, data }) => {
    // todo
    const token = ''
    response(ctx.socket, 'token')
})
