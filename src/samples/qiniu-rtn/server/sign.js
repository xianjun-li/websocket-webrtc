const EventEmitter = require('events')

const Koa = require('koa')

const WebSocket = require('ws');

function isJSON(str) {
    return new Promise(
        (resolve, reject) => resolve(JSON.parse(str))
    )
}

const koaApp = new Koa()

let server = koaApp.listen(3000)

let wsServer = new WebSocket.Server({ server })

const feaure = {
    auth: false
}

koaApp.use(async ctx => {
    ctx.body = 'hello world'
})

const eventEmitter = new EventEmitter();

wsServer.on('connection', (socket, req) => {
    // setListeners({ ws, feaure, eventEmitter })
    const ctx = {
        socket,
        req,
        feaure
    }
    // todo 按room分为不同的channel
    eventEmitter.emit('socket.connection', ctx)
})

// event handles
eventEmitter.on('socket.connection', ctx => {

    let socket = ctx.socket

    socket.send('connection')

    socket.on('message', message => {
        eventEmitter.emit('socket.message', [ctx, message])
    })

    // if (typeof feaure.auth !== 'undefined' && feaure.auth === true) {
    //     eventEmitter.emit('check_auth', ctx)
    // }

    // 销毁

})

eventEmitter.on('socket.message', ([ctx, message]) => {
    console.log(message)
})

eventEmitter.on('socket.auth', ([ctx, message]) => {
    console.log(message)
})

eventEmitter.on('socket.time_out', ([ctx, message]) => {
    console.log(message)
})

// todo 心跳检测

// todo broadcast


function setListeners(ctx) {
    const ws = ctx.ws
    const feaure = ctx.feaure;
    const eventEmitter = ctx.eventEmitter;



    eventEmitter.on('socket_binding', ctx => {
        ctx.on('message', (message) => {
            ctx.send(`pong: ${message}`)
            console.log(message)

            isJSON(message)
                .then(obj => {
                    if (typeof obj.action !== 'undefined'
                        && obj.action === 'auth'
                        && typeof feaure.auth !== 'undefined'
                        && feaure.auth === true
                    ) {
                        eventEmitter.emit('auth', messageObj)
                    }
                })
        })
    })

    /*
    // auth
    let authed = false
    let timer = null
    let max_time = 5000
    eventEmitter.on('check_auth', ctx => {
        console.log('check_auth')
        if(authed !== true) {
            if(timer === null) {
                timer = setInterval(() => {
                    if(max_time <= 0) {
                        wsServer.close()
                        clearInterval(timer)
                    } else {
                        max_time -= 50
                    }
                }, 50)
            }
        }
    })

    eventEmitter.on('auth', ctx => {
        console.log('auth')
        if(max_time >0) {
            console.log('auth success')
            // @todo 根据type使用不用的验证方式,type不匹配时验证失败;指定的验证方式验证失败时,验证失败;默认使用jwt(json web token)方式
            authed = true
            if(timer !== null) {
                clearInterval(timer)
            }
        }
    })
    */

    // todo broadcast
}

