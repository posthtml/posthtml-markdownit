import path from 'node:path'
import {readFileSync} from 'node:fs'
import {render} from 'posthtml-render'
import {parser} from 'posthtml-parser'
import MarkdownIt from 'markdown-it'
import minIndent from 'min-indent'

const normalize = data => {
  const indents = minIndent(data)

  // Removing indents
  if (indents !== 0) {
    const replaceRegex = new RegExp(`^[ \\t]{${indents}}`, 'gm')

    return data.replace(replaceRegex, '')
  }

  return data
}

const parse = (data, parser, hasTag) => {
  // Parsing content
  const parsed = parser.render(data)

  return hasTag ? `\n${parsed}` : parsed
}

const importMarkdown = (src, settings) => {
  const from = path.resolve(settings.root, src)
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
    md.use(plugin.plugin, plugin.options || {})
  }

  return tree => {
    tree.match([
      {tag: 'md'},
      {tag: 'markdown'},
      {attrs: {md: ''}},
      {attrs: {markdown: ''}}
    ], node => {
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

        ['md', 'markdown'].forEach(attribute => {
          if (attribute in node.attrs) {
            delete node.attrs[attribute]
          }
        })

        // Import markdown file if specified
        const src = node.attrs.src || false

        if (src) {
          content += importMarkdown(src, settings)

          if (tree.messages) {
            tree.messages.push({
              type: 'dependency',
              file: src
            })
          }

          delete node.attrs.src
        }
      }

      // Converting content to html tree
      content += normalize(render(node.content))

      // Parsing content
      const parsed = parse(content, md, node.tag)

      // Converting tree to html content
      node.content = parser(parsed)

      return node
    })

    return tree
  }
}

export default plugin
