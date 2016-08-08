const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

function createFile(dir, idx = null){
  mkdirp(dir)
  if(idx === null)
    return function(idx){
      fs.writeFileSync(
        path.resolve(dir, `file_${idx}.md`)
      , `---\nlayout: index.jade\n---\n\n# file ${idx}.`
      , 'utf-8'
      , (err) => console.error(err) )
    }
  else
    fs.writeFileSync(
      path.resolve(dir, `file_${idx}.md`)
    , `---\nlayout:index.jade\n---\n# file ${idx}.`
    , 'utf-8'
    , (err) => console.error(err) )
}

const cf = createFile(path.resolve(__dirname, 'withLayout/src/test'))
const cff = createFile(path.resolve(__dirname, 'withoutLayout/src/test'))

for(let i = 0;i < 1000 ; i++){
  cff(i)
  cf(i)
}
