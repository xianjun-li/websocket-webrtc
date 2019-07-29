const EventEmitter = require('events')

const Koa = require('koa')

const WebSocket = require('ws');

const koaApp = new Koa()

let server = koaApp.listen(3000)

koaApp.use(async ctx => {
    ctx.body = 'hello world'
})

let wsServer = new WebSocket.Server({ server })

const feaure = {
    auth: false
}

function isJSON(str) {
    return new Promise(
        (resolve, reject) => resolve(JSON.parse(str))
    )
}

function setListeners(ctx) {
    const ws = ctx.ws
    const feaure = ctx.feaure;
    const eventEmitter = ctx.eventEmitter;

    eventEmitter.on('socket_connection', ctx => {
        ctx.send('connection')
        eventEmitter.emit('socket_binding', ctx)

        if (typeof feaure.auth !== 'undefined' && feaure.auth === true) {
            eventEmitter.emit('check_auth', ctx)
        }
    })

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

// todo 每次连接成功后,将用户信息作为上下文数据
wsServer.on('connection', ws => {
    const eventEmitter = new EventEmitter();

    setListeners({ ws, feaure, eventEmitter })
    eventEmitter.emit('socket_connection', ws)
})