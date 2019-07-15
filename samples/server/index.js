const EventEmitter = require('events')

const eventEmitter = new EventEmitter();

const Koa = require('koa')

const WebSocket = require('ws');

const koaApp = new Koa()

let server = koaApp.listen(3000)

koaApp.use(async ctx => {
    ctx.body = 'hello world'
})

let wsServer = new WebSocket.Server({ server })

wsServer.on('connection', ws => {
    eventEmitter.emit('socket_connection', ws)
})

eventEmitter.on('socket_connection', ctx => {
    ctx.send('connection')
    eventEmitter.emit('check_auth', ctx)
    eventEmitter.emit('socket_binding', ctx)
})

eventEmitter.on('socket_binding', ctx => {
    ctx.on('message', (message) => {
        ctx.send(`pong: ${message}`)

        const messageObj = JSON.parse(message)

        if(messageObj.action === 'auth') {
            eventEmitter.emit('auth', messageObj)
        }
    })
})

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


// todo broadcast