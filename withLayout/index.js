const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const revision = require('metalsmith-revision').default
const { red, blue, yellow, bold } = require('chalk')

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}

let with_start, with_fetch, with_processing, with_build, with_nb
let revision_with_start, revision_with_fetch, revision_with_processing, revision_with_build, revision_with_nb


// With layout plugin
const p = new Promise((resolve, reject) => {
  with_start = clock()
  Metalsmith(__dirname)
    .destination('withoutRevision')
    .use((f, m, done) => {
      with_nb = Object.keys(f).length
      done()
    })
    .use((f, m, done) => {
      with_fetch = clock(with_start)
      with_start = clock()
      done()
    })
    .use(markdown())
    .use(layouts({engine: 'jade'}))
    .use((f, m, done) => {
      with_processing = clock(with_start)
      with_start = clock()
      done()
    })
    .build((err) => {
      if(err) throw(err)
      with_build = clock(with_start)
      resolve(true)
    })
})
.then(() => {
  return new Promise((resolve, reject) => {
    revision_with_start = clock()
    Metalsmith(__dirname)
      .destination('withRevision')
      .use((f, m, done) => {
        revision_with_nb = Object.keys(f).length
        done()
      })
      .use((f, m, done) => {
        revision_with_fetch = clock(revision_with_start)
        revision_with_start = clock()
        done()
      })
      .use(revision({layout: true}))
      .use(markdown())
      .use(layouts({engine: 'jade'}))
      .use((f, m, done) => {
        revision_with_processing = clock(revision_with_start)
        revision_with_start = clock()
        done()
      })
      .build((err) => {
        if(err) throw(err)
        revision_with_build = clock(revision_with_start)
        resolve(true)
      })
  })
})
.then(() => {

  console.log(blue('Without metalsmith-revision :'))
  console.log(red(`  Number of files: ${with_nb}`))
  console.log(yellow(`  Fetch files in: ${with_fetch} ms`))
  console.log(yellow(`  Process files in: ${with_processing} ms`))
  console.log(yellow(`  Build files in: ${with_build} ms`))

  console.log(red(bold('\n\nPerformance with Revision plugin.\n\n')))

  console.log(blue('With metalsmith-revision :'))
  console.log(red(`  Number of files: ${revision_with_nb}`))
  console.log(yellow(`  Fetch files in: ${revision_with_fetch} ms`))
  console.log(yellow(`  Process files in: ${revision_with_processing} ms`))
  console.log(yellow(`  Build files in: ${revision_with_build} ms`))
})
