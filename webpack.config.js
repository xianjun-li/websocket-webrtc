const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const DotEnvPlugin = require('dotenv-webpack')
const vConsolePlugin = require('vconsole-webpack-plugin')

function getIPAdress() {
  const interfaces = require('os').networkInterfaces()

  for (let devName in interfaces) {
    let arr = interfaces[devName]

    for (let i in arr) {
      let item = arr[i]

      if (item.family === 'IPv4' && item.internal === false && item.address !== '127.0.0.1' && item.address.substr(0, 3) === '192') {
        return item.address
      }
    }
  }

  return null
}

const dotenv_config = require('dotenv').config()
const sign_server_host = (typeof dotenv_config.error === 'undefined' && typeof dotenv_config.parsed.sign_server_host !== 'undefined') ?
  dotenv_config.parsed.sign_server_host :
  `wss://${getIPAdress()}:3000`

module.exports = {
  mode: 'production',
  entry: './src/samples/qiniu-rtn/client/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/js')
  },
  resolve: {
    modules: [
      path.resolve('./node_modules'),
      path.resolve('./src'),
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
    }
  },
  plugins: [
    new DotEnvPlugin(),
    new webpack.DefinePlugin({
      process: {
        env: {
          sign_server_host: JSON.stringify(sign_server_host),
        }
      }
    }),
    new vConsolePlugin({
      enable: true // 发布代码前记得改回 false
    }),
    new CopyPlugin([
      // { from: path.resolve(__dirname, 'src/samples/qiniu-rtn/client/live_server.js'), to: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/live_server.js') },
      {
        from: path.resolve(__dirname, 'src'),
        to: path.resolve(__dirname, 'dist'),
        ignore: ['*.js', '*.ml'],
      }
    ]),
  ],
  devtool: 'inline-source-map'
};