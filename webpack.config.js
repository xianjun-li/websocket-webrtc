const path = require('path');

module.exports = {
  entry: './samples/client/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './samples/client/dist')
  }
};