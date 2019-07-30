// https_config
const fs = require("fs")
// const path = require('path')

module.exports = {
    cert: fs.readFileSync(__dirname + "/cert.pem"),
    key: fs.readFileSync(__dirname + "/key.pem"),
    passphrase: "12345",
};