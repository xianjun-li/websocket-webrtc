// require third party library
const Path = require('path')
const chokidar = require('chokidar')

// path
const current_path = __dirname
const project_path = process.env.PWD
const src_path = Path.join(project_path, 'src')
const dist_path = Path.join(project_path, 'dist')

// instance
const sub_module_config = require(Path.join(project_path, 'sub_module.config.js'))

const watcher = chokidar.watch(src_path)

const isChildOf = (child, parent) => {
    if (child === parent) return true
    const parentTokens = parent.split('/').filter(i => i.length)
    const childTokens = child.split('/').filter(i => i.length)

    return parentTokens.every((element, index) => {
        return element === childTokens[index]
    })
}

watcher.on('ready', () => {
    // TODO 根据 不同的目录,运行不同的配置文件进行打包
    watcher.on('all', (action, change_path) => {
        change_path = Path.resolve(change_path)
        const relative_path = Path.relative(project_path, change_path)
        console.log(`\n ${relative_path} ${action} : \n`)

        let match_sub_module = null
        // todo match sub_module
        sub_module_config.some((item) => {
            if (isChildOf(
                Path.resolve(Path.dirname(change_path)).substring(1),
                Path.resolve(item.path).substring(1)
            )) {
                match_sub_module = item
                return true
            }
        })

        if (match_sub_module) {
            console.log(match_sub_module)
            // run sub_module tasks
            match_sub_module.onchange(change_path, action)
        }


    })
})


