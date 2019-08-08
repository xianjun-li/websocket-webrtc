import EventEmitter from 'events'

export default class Client extends EventEmitter {

    constructor() {
        super()

        this.socket = null
        this.idStatus = new Map()
        this.idValues = new Map()
        this.id = 0
    }

    // {{{ id 相关方法
    getNewId() {
        this.id++
        return this.id
    }

    getIdStatus(id) {
        return this.idStatus.get(id)
    }

    setIdStatus(id, value) {
        return this.idStatus.set(id, value)
    }

    getIdValues(id) {
        return this.idValues.get(id)
    }

    setIdValues(id, value) {
        return this.idValues.set(id, value)
    }

    deleteId(id) {
        console.log('delete id status')
        this.idStatus.delete(id)
        this.idValues.delete(id)
    }

    // id 相关方法 }}}

    connection(host, protocols) {
        if (typeof protocols !== 'string') {
            if ((typeof protocols === 'object') && (Object.is(protocols, null) === false)) {
                protocols = protocols.toString()
            } else {
                protocols = ''
            }
        }

        const url = `${host}?token=` + Math.random().toString(36).substring(7)
        const socket = protocols === '' ? (new WebSocket(url)) : (new WebSocket(url, protocols))

        socket.addEventListener('message', event => {
            const data = JSON.parse(event.data)

            if (typeof data.id !== 'undefined') {
                if (typeof data.error !== 'undefined') {
                    this.setIdStatus(data.id, (typeof data.error['code'] === 'undefined') ? data.error['code'] : 1)
                    this.setIdValues(data.id, data.error)
                } else {
                    this.setIdStatus(data.id, 0)
                    this.setIdValues(data.id, data.result)
                }
            }
        })

        this.socket = socket

        return socket
    }

    send(data, ack) {
        let promise = null

        if (this.socket === null) {
            return new Promise((resolve, reject) => {
                reject('websocket not connection')
            })
        } else if (this.socket.readyState !== 1) {

            if (this.socket.readyState === 2 || this.socket.readyState === 3) { // closing or closed
                return new Promise((resolve, reject) => {
                    reject('websocket is closed')
                })

            } else { // 0
                //return promise
                const socket = this.socket

                return new Promise((resolve, reject) => {
                    let timer = setInterval(() => {
                        if (socket.readyState === 1) {
                            clearInterval(timer)
                            resolve(this.send(data, ack))
                        } else if (this.socket.readyState === 2 || this.socket.readyState === 3) {
                            clearInterval(timer)
                            reject('websocket is closed')
                        }
                    }, 0)
                })
            }
        } else {
            if (ack === true) {

                const id = this.getNewId()
                this.setIdStatus(id, -1) // pending
                data.id = id

                promise = new Promise((resolve, reject) => {
                    // todo 超时处理

                    // observe idStatus
                    let timer = setInterval(() => {
                        const id_status = this.getIdStatus(id)
                        if (id_status === 0) {
                            clearInterval(timer)
                            // 返回对应数据
                            resolve(this.getIdValues(id))
                            // 销毁对应ID STATUS
                            this.deleteId(id)
                        } else if (id_status !== -1) {
                            clearInterval(timer)
                            reject(this.getIdValues(id))
                            // 销毁对应ID STATUS
                            this.deleteId(id)
                        }
                    }, 0);
                })
            }

            socket.send(JSON.stringify(data))
            return ack ? promise : null
        }
    }

    receive(data, ack = false) {

    }
}

// 事件:
//     连接
//     关闭  