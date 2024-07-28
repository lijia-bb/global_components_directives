const path = require('path')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']
module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js', // 因为我们改了src目录，所以对应的入口文件配置也要做修改
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: (config) => {
    config.module
      .rule('js')
      .include.add(path.resolve(__dirname, 'components'))
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
