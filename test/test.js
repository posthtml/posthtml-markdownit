import path from 'node:path'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import test from 'ava'
import posthtml from 'posthtml'
import markdownitEmoji from 'markdown-it-emoji'
import plugin from '../lib/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8')

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const compare = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('Basic', t => {
  return compare(t, 'basic')
})

test('Fenced code block', t => {
  return compare(t, 'code')
})

test('Custom tag', t => {
  return compare(t, 'change-tag')
})

test('Render markdown in imported file', t => {
  return compare(t, 'importing')
})

test('Render markdown inline from imported file', t => {
  return compare(t, 'importing-inline')
})

test('Uses markdown-it plugins', t => {
  return compare(t, 'md-plugin', {
    plugins: [{
      plugin: markdownitEmoji
    }]
  })
})

test('Uses markdown-it options', t => {
  return compare(t, 'md-options', {
    markdownit: {
      linkify: true
    }
  })
})
