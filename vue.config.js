const glob = require('glob')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 排除views目录下的所有js目录, 其它js文件都当做入口
const files = glob.sync('src/views/**/*.js', {ignore:'src/views/**/js/*'})
const outputDir = process.env.NODE_ENV === 'development' ? 'dist' : 'widget'
const pages = {}
const filenames = []
files.forEach((file) => {
  const key = file.substring(10, file.length - 3).replace(/\//g, '_')
  filenames.push(key)
  pages[key] = {
    entry: ['./src/main.js', file],
    filename: `${key}.html`,
    title: '',
    chunks: ['chunk-vendors', 'chunk-common', key]
  }
})
module.exports = {
  publicPath: './',
  outputDir,
  productionSourceMap: false,
  pages,
  chainWebpack: config => {
    // 解决html-webpack-plugin多页面打包慢的问题
    filenames.forEach(filename => {
      config.plugins.delete(`preload-${filename}`)
      config.plugins.delete(`prefetch-${filename}`)
    })
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => {
            options.limit = 1
            return options
          })
  },
  configureWebpack: {
    devtool: false,
    plugins: [
      // 拷贝config.xml
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(`src/config/${process.env.NODE_ENV}.xml`),
            to: `${path.resolve(outputDir)}/config.xml`,
            toType: 'file',
            flatten: true
          }
        ]
      })
    ]
  }
}
