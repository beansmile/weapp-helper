const fs = require('fs-extra')
const ghpages = require('gh-pages')

ghpages.publish('dist', {
  branch: 'dist',
}, err => {
  if (err) console.error(err)
  else {
    fs.removeSync('dist')
    console.log('success')
  }
})
