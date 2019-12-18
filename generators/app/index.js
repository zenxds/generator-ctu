const os = require('os')
const path = require('path')
const fs = require('fs')
const colors = require('colors')
const Generator = require('yeoman-generator')
const config = require('./config')
const util = require('../../lib/util')

const isNotSimpleMode = answers => !util.isSimpleMode(answers.type)

class CTU extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  
  /**
   * 初始化函数
   * 检查项目状态，获取配置等
   * 
   * 
   * @memberof CTU
   */
  initializing() {
    this.answers = {} // prompting答案
  }

  prompting() {
    const basename = path.basename(this.destinationRoot())
    
    return this.prompt([
      {
        type: 'list',
        name: 'type',
        message: '请选择项目类型',
        choices: config.projects.map((item, index) => {
          return {
            name: item.description,
            value: { ...item, index },
          }
        }),
        store: true,
        pageSize: 20
      },
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名',
        default: basename,
        // 简单模式不需要输入项目名
        when: isNotSimpleMode
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入项目版本号',
        default: '0.1.0',
        // 简单模式不需要输入版本号
        when: isNotSimpleMode
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入项目描述',
        default: basename,
        // 简单模式不需要输入项目描述
        when: isNotSimpleMode
      },
      {
        type: 'input',
        name: 'author',
        message: '请输入项目作者',
        default: os.userInfo().username,
        // 简单模式不需要输入作者
        when: isNotSimpleMode
      }
    ])
    .then((answers) => {
      this.answers = answers
    })
  }

  configuring() {
    this.config.save()
  }

  writing() {
    const answers = this.answers
    const repository = config.projects[answers.type.index].repository
    const isSimpleMode = util.isSimpleMode(answers.type)
    const root = isSimpleMode ? process.cwd():this.destinationRoot()
    const jsonPath = path.join(root, 'package.json')

    if (!util.isEmptyDir(root)) {
      return Promise.reject('目标目录不为空')
    }
    
    this.log('正在下载项目模板'.green)
    
    // 简单模式仅需要下载模板到当前目录
    if (isSimpleMode) {
      return util.downloadAndUnzip(repository, process.cwd()).then(() => {
        this.log('当前任务已完成'.blue)
      })
    }

    return util.downloadAndUnzip(repository, root).then(() => {
      const json = require(jsonPath)
      Object.assign(json, {
        name: answers.name,
        version: answers.version,
        description: answers.description,
        author: {
          name: answers.author
        }
      })

      fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2))
    })
  }

  install() {
    const answers = this.answers
    // 简单模式不需要执行安装
    if (util.isSimpleMode(answers.type)) return

    const root = this.destinationRoot()
    const useYarn = fs.existsSync(path.join(root, 'yarn.lock'))

    this.log('正在安装项目依赖'.green)    
    this.spawnCommandSync(useYarn ? 'yarn' : 'npm', ['install', '--registry=https://registry.dingxiang-inc.net'])
    this.log('正在启动项目'.green)
    this.spawnCommandSync('npm', ['start'])
  }

  end() {}
}

module.exports = CTU
