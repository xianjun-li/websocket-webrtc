const path = require('path');

module.exports = {
  entry: './src/client/main.js',
  output: {
    filename: 'client/main.js',
    path: path.resolve(__dirname, 'dist')
  }
};