let default_host = null
let socket = null

function setDefaultHost(host) {
    default_host = host
}

function getDefaultHost() {
    return default_host
}

// connection websocket
function connection(host, protocols, options) {
    if (typeof protocols !== 'string') {
        if ((typeof protocols === 'object') && (Object.is(protocols, null) === false)) {
            protocols = protocols.toString()
        } else {
            protocols = ''
        }
    }

    let url = `${host}?token=123456`
    
    socket = protocols === '' ? (new WebSocket(url)) : (new WebSocket(url, protocols))

    // 绑定事件
    if (options) {
        Object.keys(options).filter(val => {
            return (val.substr(0, 2) === 'on')
        }).forEach(val => {
            let event_name = val.substr(2).toLowerCase()

            socket.addEventListener(event_name, options[val])
        })
    }

    return socket
}

function close() {
    socket = null
}

function request(data) {
    return socket.send(typeof data === 'string' ? data : JSON.stringify(data))
}

export { getDefaultHost, setDefaultHost, connection, close, request }
