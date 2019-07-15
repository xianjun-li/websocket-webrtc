// websocket

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
    eventEmitter.emit('socket_binding', ctx)
})

eventEmitter.on('socket_binding', ctx => {
    ctx.on('message', () => {
        ctx.send('pong')
    })
})



// qiniu