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

let without_start, without_fetch, without_processing, without_build, without_nb
let revision_without_start, revision_without_fetch, revision_without_processing, revision_without_build, revision_without_nb

// With layout plugin
const p = new Promise((resolve, reject) => {
  without_start = clock()
  Metalsmith(__dirname)
    .destination('withoutRevision')
    .use((f, m, done) => {
      without_nb = Object.keys(f).length
      done()
    })
    .use((f, m, done) => {
      without_fetch = clock(without_start)
      without_start = clock()
      done()
    })
    .use(markdown())
    .use((f, m, done) => {
      without_processing = clock(without_start)
      without_start = clock()
      done()
    })
    .build((err) => {
      if(err) throw(err)
      without_build = clock(without_start)
      resolve(true)
    })
})
.then(() => {
  return new Promise((resolve, reject) => {
    revision_without_start = clock()
    Metalsmith(__dirname)
      .clean(false)
      .destination('withRevision')
      .use((f, m, done) => {
        revision_without_nb = Object.keys(f).length
        done()
      })
      .use((f, m, done) => {
        revision_without_fetch = clock(revision_without_start)
        revision_without_start = clock()
        done()
      })
      .use(revision())
      .use(markdown())
      .use((f, m, done) => {
        revision_without_processing = clock(revision_without_start)
        revision_without_start = clock()
        done()
      })
      .build((err) => {
        if(err) throw(err)
        revision_without_build = clock(revision_without_start)
        resolve(true)
      })
  })
})
.then(() => {
  console.log(blue('Without metalsmith-layouts :'))
  console.log(red(`  Number of files: ${without_nb}`))
  console.log(yellow(`  Fetch files in: ${without_fetch} ms`))
  console.log(yellow(`  Process files in: ${without_processing} ms`))
  console.log(yellow(`  Build files in: ${without_build} ms`))

  console.log(red(bold('\n\nPerformance with Revision plugin.\n\n')))

  console.log(blue('Without metalsmith-layouts and with metalsmith-revision :'))
  console.log(red(`  Number of files: ${revision_without_nb}`))
  console.log(yellow(`  Fetch files in: ${revision_without_fetch} ms`))
  console.log(yellow(`  Process files in: ${revision_without_processing} ms`))
  console.log(yellow(`  Build files in: ${revision_without_build} ms`))
})
