import jsonwebtoken from 'jsonwebtoken'

function genJwtToken() {
    const token = jsonwebtoken.sign({ foo: 'bar' }, 'ssssss')
    return token
}

function main() {

    const ws_url = 'ws://localhost:3000'

    // @todo 自定义子协议
    const ws_protocols = null

    const ws = new WebSocket(ws_url, ws_protocols)
    console.log(ws)

    //events: open, message, error, close

    ws.addEventListener('open', event => {
        const auth_content = {
            action: 'auth',
            type: 'jwt',
            token: genJwtToken()
        }
        ws.send(JSON.stringify(auth_content))
    })

    ws.addEventListener('message', event => {
        console.log(event)
    })
}

main()