const os = require('os')
const path = require('path')
const fs = require('fs')
const colors = require('colors')
const Generator = require('yeoman-generator')
const config = require('./config')
const util = require('../../lib/util')

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
    return this.prompt([
      {
        type: 'list',        
        name: 'type',
        message: '请选择项目类型',
        choices: config.projects.map((item, index) => {
          return {
            name: item.description,
            value: index
          }
        }),
        store: true
      },
      {
        type: 'input',        
        name: 'name',
        message: '请输入项目名',
        default: this.appname
      },
      {
        type: 'input',        
        name: 'version',
        message: '请输入项目版本号',
        default: '0.1.0'
      },
      {
        type: 'input',        
        name: 'author',
        message: '请输入项目作者',
        default: os.userInfo().username
      }
    ]).then((answers) => {
      this.answers = answers
    })
  }

  configuring() {
    this.config.save()
  }

  writing() {
    const root = this.destinationRoot()
    const jsonPath = path.join(root, 'package.json')    
    const answers = this.answers
    const repository = config.projects[answers.type].repository

    this.log('正在下载项目模板'.green)
    return util.downloadAndUnzip(repository, root).then(() => {
      const json = require(jsonPath)
      Object.assign(json, {
        name: answers.name,
        version: answers.version,
        author: answers.author
      })

      fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2))
    })
  }

  install() {
    this.log('正在下载项目依赖'.green)    
    this.spawnCommandSync('npm', ['install', '--registry=https://registry.npm.taobao.org'])
    this.spawnCommandSync('npm', ['start'])
  }

  end() {}
}

module.exports = CTU