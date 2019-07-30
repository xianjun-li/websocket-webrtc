const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'production',
  entry: './src/samples/qiniu-rtn/client/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/js')
  },
  plugins: [
    new Dotenv(),
    new CopyPlugin([
      // { from: path.resolve(__dirname, 'src/samples/qiniu-rtn/client/live_server.js'), to: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/live_server.js') },
      { from: path.resolve(__dirname, 'src'), to: path.resolve(__dirname, 'dist'), ignore: ['*.js', '*.ml'], }
    ]),
  ],
  devtool: 'inline-source-map'
};