module.exports = {
    apps: [
        {
            name: "sign_server",
            script: "./src/samples/qiniu-rtn/server/sign.js",
            watch: true,
            env: {
                "NODE_ENV": "development",
            },
            env_production: {
                "NODE_ENV": "production"
            }
        },

        {
            name: "live_server",
            script: "./src/samples/qiniu-rtn/client/live_server.js",
            watch: true,
            env: {
                "NODE_ENV": "development",
            },
            env_production: {
                "NODE_ENV": "production"
            }
        }
    ]
} 