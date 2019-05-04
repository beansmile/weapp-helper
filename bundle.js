const fs = require('fs-extra')
const glob = require("glob")
const babel = require("@babel/core")

glob.sync('src/**/*.{js,ts}').forEach(file => {
  const result = babel.transformFileSync(file)
  fs.outputFileSync(file.replace(/^src/, 'dist').replace(/\.ts$/, '.js'), result.code)
})
fs.copySync('./package.json', './dist/package.json')
fs.copySync('./README.md', './dist/README.md')
