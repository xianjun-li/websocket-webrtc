const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const vConsolePlugin = require('vconsole-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/samples/qiniu-rtn/client/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/js')
  },
  plugins: [
    new Dotenv(),
    new vConsolePlugin({
      filter: [],  // 需要过滤的入口文件
      enable: true // 发布代码前记得改回 false
    }),
    new CopyPlugin([
      // { from: path.resolve(__dirname, 'src/samples/qiniu-rtn/client/live_server.js'), to: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/live_server.js') },
      { from: path.resolve(__dirname, 'src'), to: path.resolve(__dirname, 'dist'), ignore: ['*.js', '*.ml'], }
    ]),
  ],
  devtool: 'inline-source-map'
};