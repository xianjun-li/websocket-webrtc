const ws = new WebSocket('ws://localhost:3000')

ws.onopen = event => {
    ws.send("open!")
}

ws.addEventListener('message', event => {
    console.log('message', event.data)
})

ws.onerror = event => {
    console.log('error', event.data)
}

ws.onclose = event => {
    console.log('close', event.data)
}

function wx_close() {
    ws.close()
    clearInterval(timer)
}

const timer = setInterval(() => {
    ws.send('ping')
}, 10000)