const Path = require('path')
const webpack = require('webpack')

const current_path = __dirname
const project_path = process.env.PWD
const src_path = Path.join(project_path, 'src')
const dist_path = Path.join(project_path, 'dist')

function run_webpack(webpack_config) {
  const compiler = webpack(webpack_config)
  return compiler.run((err, stats) => {
    console.log('webpack start:')
    if (err) {
      console.log('webpack error')
    } else {
      console.log('webpack success')
      // todo 重启服务
    }
  })
}

const sub_module = [
  {
    name: "qiniu-rnt-demo",
    path: "./src/samples/qiniu-rtn",
    onchange: function (change_path, change_type) {

      console.log(`qiniu-rnt-demo onchange handler`)
      const webpack_config = require(Path.join(project_path, 'webpack.config.js'))
      run_webpack(webpack_config)

    },
  }
]

module.exports = sub_module