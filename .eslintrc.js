module.exports = {
  root: true,
  env: {
    node: true // Node.js 全局变量和 Node.js 作用域
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint', // 解析器，默认使用Espree
    ecmaVersion: 6 // 支持es6语法，但并不意味着同时支持新的 ES6 全局变量或类型（比如 Set 等新类型）
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    // //强制使用单引号
    // quotes: ['error', 'single'],
    // //强制不使用分号结尾
    // semi: ['error', 'never'],
    // 'prettier/prettier': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
