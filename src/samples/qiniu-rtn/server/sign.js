const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const UrlParser = require('url')
const https = require('https')

const jwt = require('jsonwebtoken')
// http server lib
const Koa = require('koa')
// websocket server lib
const WebSocket = require('ws')
// qiniu sdk
const qiniu = require('qiniu')
const dotenv = require('dotenv')

// function isJSON(str) {
//     return new Promise(
//         (resolve, reject) => resolve(JSON.parse(str))
//     )
// }

const eventEmitter = new EventEmitter()
const app = new Koa()

const https_options = {
    port: 3000,
    cert: fs.readFileSync(path.resolve(path.join(__dirname, '/../../../../cert.pem'))).toString(),
    key: fs.readFileSync(path.resolve(path.join(__dirname, '/../../../../key.pem'))).toString()
}
// console.log(https_options)

const webServer = https.createServer(https_options, app.callback()).listen(3000)
// const webServer = app.listen(3000)

const wsServer = new WebSocket.Server({
    server: webServer
})

// config and setting
const _env_data = dotenv.config()
const env_data = _env_data.error ? {} : _env_data.parsed

const feaure = {
    auth: true
}

function get_jwt_secret_key() {
    return ' '
}

// get_jwt api:
app.use(async ctx => {
    await ctx.set('Access-Control-Allow-Origin', '*')

    const query = ctx.request.query
    const user_id = query.user_id
    const token = jwt.sign({ user_id }, get_jwt_secret_key())
    ctx.body = JSON.stringify({ token })
})

const online_users = {};


webServer.on('upgrade', function upgrade(request, socket, header) {

    console.log('upgrade: check auth code:')
    const url_info = UrlParser.parse(request.url, true);

    if (typeof url_info.query['token'] === 'undefined') {
        // socket.terminate()
        socket.destroy()
        return
    }

    const auth_token = url_info.query['token']

    // check auth
    try {
        const auth_token_decode = jwt.verify(auth_token, get_jwt_secret_key())
        console.log(auth_token_decode)
        // online_users[auth_token_decode.user_id] = {
        //     status: 1
        // }
        // console.log(online_users)

        // wsServer.handleUpgrade(request, socket, header, function done(ws) {
        //     wsServer.emit('connection', ws, request);
        // });

    } catch (error) {
        console.log(error)
        console.log('jwt code verify error')
        // socket.terminate()
        socket.destroy()
    }
});

// req : http.IncomingMessage
wsServer.on('connection', (socket, req) => {

    console.log('connection')
    const ctx = {
        feaure,
        socket
    }

    eventEmitter.emit('socket.connection', ctx)

    socket.on('message', message => {
        eventEmitter.emit('socket.message', [ctx, message])
    })
})

// event handles
// eventEmitter.on('socket.connection', ctx => {
//     // app info
//     const app_info = {
//         app_id: env_data.rtn_app_id
//     }
//     ctx.socket.send(JSON.stringify(app_info))
// })



eventEmitter.on('socket.message', ([ctx, message]) => {
    let req_type = null

    try {
        console.log('message', message)
        const data = JSON.parse(message)

        if (data['method'] !== undefined) {
            const method = data.method
            const params = (data['params'] !== undefined ? data.params : {})
            const id = (data['id'] !== 'undefined' ? data.id : null)

            eventEmitter.emit(method, {
                ctx,
                params,
                id
            })
        } else {
            eventEmitter.emit('error', {
                ctx,
                error: {
                    message: '请求无method参数'
                }
            })
        }
    } catch (error) {
        console.log('error', error)
        eventEmitter.emit('error', {
            ctx,
            error: {
                message: 'json解析错误'
            }
        })
        return
    }
})

eventEmitter.on('getRoomToken', ({
    ctx,
    params,
    id
}) => {

    if (params['username'] === undefined || params['roomname'] === undefined) {
        const error = {
            message: '用户名或房间号为空'
        }
        eventEmitter.emit('error', {
            ctx,
            error,
            id
        })
    } else {
        const username = params.username
        const roomname = params.roomname

        const app_id = env_data.rtn_app_id
        const qiniu_ak = env_data.qiniu_ak
        const qiniu_sk = env_data.qiniu_sk
        const qiniu_credentials = new qiniu.Credentials(qiniu_ak, qiniu_sk)

        const token = qiniu.room.getRoomToken({
            appId: app_id,
            roomName: roomname,
            userId: username,
            expireAt: Date.now() + (1000 * 60 * 60 * 3), // token 的过期时间默认为当前时间之后 3 小时
            permission: 'user'
        }, qiniu_credentials)

        const data = {
            result: {
                roomToken: token
            },
            id
        }

        ctx.socket.send(JSON.stringify(data))
    }
})

eventEmitter.on('error', ({
    ctx,
    error,
    id
}) => {

    if (error['code'] === undefined) {
        error.code = -32000
    }

    if (error['message'] === undefined) {
        error.message = ''
    }

    if (error['data'] === undefined) {
        error.data = {}
    }

    ctx.socket.send(JSON.stringify({
        error,
        id
    }))
})

// todo 心跳检测

// todo broadcast