import { observable, autorun } from 'mobx'

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

let id_flag = 0

let idStatus = new Map()
let observers = []

function newId() {
    id_flag += 1
    return id_flag
}

function getIdStatus(id) {
    return idStatus.get(id)
}

function setIdStatus(id, value) {
    return idStatus.set(id, value)
}

function request(data, ack) {
    const id = newId()
    setIdStatus(id, -1)
    data.id = id

    if(ack) {
        // todo observe idStatus
    }

    socket.send(typeof data === 'string' ? data : JSON.stringify(data))
    return { id }
}

export { getDefaultHost, setDefaultHost, connection, close, request, setIdStatus, getIdStatus }
