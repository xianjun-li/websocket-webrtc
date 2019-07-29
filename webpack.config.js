const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/samples/qiniu-rtn/client/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/samples/qiniu-rtn/client/js')
  },
  // devtool: 'inline-source-map'
};