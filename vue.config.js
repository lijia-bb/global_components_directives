const path = require('path')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']
module.exports = {
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: (config) => {
    config.module
      .rule('js')
      .include.add(path.resolve(__dirname, 'packages'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap((options) => {
        // 修改它的选项...
        return options
      })
  },
  css: {
    loaderOptions: {
      sass: {
        // 这里开始是新增的配置
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    }
  }
}
