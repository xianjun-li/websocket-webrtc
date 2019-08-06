// require third party library
const Path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')

function isChildOf(child, parent) {
    if (child === parent) return true
    const parentTokens = parent.split('/').filter(i => i.length)
    const childTokens = child.split('/').filter(i => i.length)

    return parentTokens.every((element, index) => {
        return element === childTokens[index]
    })
}

function set_change_handler(watch_path, handler) {
    const watcher = chokidar.watch(watch_path)

    watcher.on('ready', () => {
        watcher.on('all', (action, change_path) => {
            change_path = Path.resolve(change_path)
            const relative_path = Path.relative(project_path, change_path)
            console.log(`\n${action} ${relative_path}`)

            return handler(action, change_path)
        })
    })
}

const project_path = Path.resolve(Path.join(__dirname, '../'))
const src_path = Path.join(project_path, 'src')
const webpack_config_path = Path.join(project_path, 'webpack.config.js')
const webpack_config = require(webpack_config_path)

const compiler = webpack(webpack_config)

set_change_handler(src_path, (action, path) => {
    return compiler.run((err, stats) => {
        console.log('webpack start:')
        if (err) {
            console.log('webpack error')
        } else {
            console.log('webpack success')
        }
    })
})