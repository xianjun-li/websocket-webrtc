const Path = require('path')
const webpack = require('webpack')

const current_path = __dirname
const project_path = process.env.PWD
const src_path = Path.join(project_path, 'src')
const dist_path = Path.join(project_path, 'dist')

const webpack_config = require(Path.join(project_path, 'webpack.config.js'))
const compiler = webpack(webpack_config)

const sub_module = [
  {
    name: "qiniu-rnt-demo",
    path: "./src/samples/qiniu-rtn",
    onchange(change_path, change_type) {

      console.log(change_path)
      return
      // bsb
      // webpack
      return compiler.run((err, stats) => {
        if (err) {
          console.log('webpack error')
        } else {
          console.log('webpack success')
          // todo 重启服务
        }
      })

    },
  }
]

module.exports = sub_module