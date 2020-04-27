const test = require('ava')
const plugin = require('../lib')
const posthtml = require('posthtml')

const {join} = require('path')
const {readFileSync} = require('fs')

const fixture = file => readFileSync(join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(join(__dirname, 'expected', `${file}.html`), 'utf8')

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const compare = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('basic', t => {
  return compare(t, 'basic')
})

test('code', t => {
  return compare(t, 'code')
})

test('change tag', t => {
  return compare(t, 'change-tag')
})

test('importing', t => {
  return compare(t, 'importing')
})

test('plugin', t => {
  return compare(t, 'plugin', {
    plugins: [{
      plugin: require('markdown-it-emoji')
    }]
  })
})
