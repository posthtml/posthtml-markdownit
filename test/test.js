import path from 'node:path'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import plugin from '../lib/index.js'
import {test, expect} from 'vitest'
import posthtml from 'posthtml'
import {light as emoji} from 'markdown-it-emoji'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8').trim()
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8').trim()

const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (_t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => expect(html).toEqual(expected(name)))
}

test('Basic', t => {
  return process(t, 'basic')
})

test('Fenced code block', t => {
  return process(t, 'code')
})

test('Custom tag', t => {
  return process(t, 'change-tag')
})

test('Render markdown in imported file', t => {
  return process(t, 'importing')
})

test('Render markdown inline from imported file', t => {
  return process(t, 'importing-inline')
})

test('Uses markdown-it plugins', t => {
  return process(t, 'md-plugin', {
    plugins: [
      {
        plugin: emoji
      }
    ]
  })
})

test('Uses markdown-it options', t => {
  return process(t, 'md-options', {
    markdownit: {
      linkify: true
    }
  })
})
