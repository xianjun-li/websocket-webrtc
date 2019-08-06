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
    new Dotenv(),
    new vConsolePlugin({
      enable: true // 发布代码前记得改回 false
    }),
    new CopyPlugin([
      // { from: path.resolve(__dirname, 'src/samples/qiniu-rtn/client/live_server.js'), to: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/live_server.js') },
      { from: path.resolve(__dirname, 'src'), to: path.resolve(__dirname, 'dist'), ignore: ['*.js', '*.ml'], }
    ]),
  ],
  devtool: 'inline-source-map'
};