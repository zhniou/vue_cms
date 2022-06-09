<<<<<<< HEAD
// 项目发布阶段需要用到的数组
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
=======
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
>>>>>>> 2b029d5 (20200609)
  ]
}
