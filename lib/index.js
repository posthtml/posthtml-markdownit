const tree2html = require('posthtml-render')
const html2tree = require('posthtml-parser')
const MarkdownIt = require('markdown-it')
const minIndent = require('min-indent')
const path = require('path')
const fs = require('fs')

function normailize (data) {
  let indents = minIndent(data)
  // removing indents
  if (indents !== 0) {
    let replaceRegex = new RegExp(`^[ \\t]{${indents}}`, 'gm')
    return data.replace(replaceRegex, '')
  } else return data
}

function parse (data, parser) {
  // Parsing content
  let parsed = parser.render(data)
  return `\n${parsed}`
}

function importMarkdown (src, settings) {
  let from = path.resolve(settings.root, src)
  let content = fs.readFileSync(from, settings.encoding)
  return normailize(content)
}

module.exports = function (options) {
  let settings = {
    root: './',
    encoding: 'utf-8',
    markdownit: {},
    plugins: [],
    ...options
  }

  let md = new MarkdownIt(settings.markdownit)
  // Add plugins to markdownParser
  for (let plugin of settings.plugins) {
    md.use(plugin.plugin, plugin.options)
  }

  return function (tree) {
    tree.match([{ tag: 'md' }, { tag: 'markdown' }], node => {
      let content = ''

      if (node.attrs) {
        // Change tag
        let tag = node.attrs.tag || false
        if (tag) {
          node.tag = tag
          delete node.attrs.tag
        } else node.tag = 'div'

        // Import markdown file if specified
        let src = node.attrs.src || false
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
      } else node.tag = 'div'

      // Converting content to html tree
      content += normailize(tree2html(node.content))

      // Parsing content
      let parsed = parse(content, md)

      // Converting tree to html content
      node.content = html2tree(parsed)
      return node
    })

    return tree
  }
}
