import {render} from 'posthtml-render'
import {parser} from 'posthtml-parser'
import MarkdownIt from 'markdown-it'
import minIndent from 'min-indent'
import {resolve} from 'node:path'
import {readFileSync} from 'node:fs'
import {match} from 'posthtml/lib/api.js'

const normalize = data => {
  const indents = minIndent(data)

  // Removing indents
  if (indents !== 0) {
    const replaceRegex = new RegExp(`^[ \\t]{${indents}}`, 'gm')

    return data.replace(replaceRegex, '')
  }

  return data
}

const parse = (data, parser, hasTag, inline) => {
  // Parsing content
  const parsed = inline ? parser.renderInline(data) : parser.render(data)

  return hasTag ? `\n${parsed}` : parsed
}

const importMarkdown = (src, settings) => {
  const from = resolve(settings.root, src)
  const content = readFileSync(from, settings.encoding)

  return normalize(content)
}

const plugin = options => {
  const settings = {
    root: './',
    encoding: 'utf8',
    markdownit: {},
    plugins: [],
    ...options
  }

  const md = new MarkdownIt(settings.markdownit)

  // Add plugins to markdownParser
  for (const plugin of settings.plugins) {
    if (typeof plugin.plugin === 'string') {
      import(plugin.plugin)
        .then(loaded => {
          plugin.plugin = loaded.default || loaded
          md.use(plugin.plugin, plugin.options || {})
        }).catch(error => {
          throw error
        })
    } else {
      md.use(plugin.plugin, plugin.options || {})
    }
  }

  return tree => {
    tree.match = tree.match || match
    tree.match([
      {tag: 'md'},
      {tag: 'markdown'},
      {attrs: {md: ''}},
      {attrs: {markdown: ''}}
    ], node => {
      let inline = false
      let content = ''

      if (['md', 'markdown'].includes(node.tag)) {
        node.tag = false
      }

      if (node.attrs) {
        // Change tag
        if (node.attrs.tag) {
          node.tag = node.attrs.tag

          delete node.attrs.tag
        }

        // Check if should render as inline
        if (Object.hasOwn(node.attrs, 'inline')) {
          if (node.attrs.inline === '' || node.attrs.inline) {
            inline = true
          }
        }

        for (const attribute of ['md', 'markdown']) {
          if (attribute in node.attrs) {
            delete node.attrs[attribute]
          }
        }

        // Import markdown file if specified
        const src = node.attrs.src || false

        if (src) {
          content += importMarkdown(src, settings)

          if (tree.messages) {
            const from = resolve(settings.root, src)

            tree.messages.push({
              type: 'dependency',
              file: from
            })
          }

          delete node.attrs.src
        }
      }

      // Converting content to html tree
      content += normalize(render(node.content))

      // Parsing content
      const parsed = parse(content, md, node.tag, inline)

      // Converting tree to html content
      node.content = parser(parsed)

      return node
    })

    return tree
  }
}

export default plugin
