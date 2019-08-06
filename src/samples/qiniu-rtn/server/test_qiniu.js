
const Koa = require('koa')


const qiniu = require('qiniu')

const koaApp = new Koa()

const server = koaApp.listen(8081)


// qiniu auth

const accessKey = ''
const secretKey = ''

// let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// let qiniu_config = new qiniu.conf.Config()

const credentials = new qiniu.Credentials(accessKey, secretKey);


function get(credentials, options, fn){
    options.headers['Authorization'] = credentials.generateAccessToken(options, null);

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            //var resultObject = JSON.parse(responseString);

            if (res.statusCode != 200) {
                var result = {
                    code: res.statusCode,
                    message: res.statusMessage
                };
                fn(result, null);
            } else {
                fn(null, JSON.parse(responseString));
            }
        });
    });

    req.on('error', function(e) {
        fn(e, null);
    });

    req.end();
}

// const roomToken = qiniu.room.getRoomToken({
//     appId: 'eclbdmgzb',
//     roomName: 'room1',
//     userId: 'user1',
//     expireAt: Date.now() + (1000 * 60 * 60 * 3), // token 的过期时间默认为当前时间之后 3 小时
//     permission: 'user',
// }, credentials)

var options = {
    host: host,
    port: 80,
    path: '/v3/apps/' + appId + '/rooms/' + roomName + '/users',
    method: 'GET',
    headers: headers
};
get(credentials, options, fn);


let data = {

    credentials,
    roomToken

}


koaApp.use(async ctx => {
    ctx.body = JSON.stringify(data)
})

