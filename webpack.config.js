const path = require('path');

module.exports = {
  entry: './samples/qiniu_voice_group_chat/js/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'samples/qiniu_voice_group_chat/dist')
  },
  devtool: 'inline-source-map'
};