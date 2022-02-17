const tree2html = require('posthtml-render')
const html2tree = require('posthtml-parser')
const MarkdownIt = require('markdown-it')
const minIndent = require('min-indent')
const path = require('path')
const fs = require('fs')

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
  const from = path.resolve(settings.root, src)
  const content = fs.readFileSync(from, settings.encoding)

  return normalize(content)
}

module.exports = options => {
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
        if (Object.prototype.hasOwnProperty.call(node.attrs, 'inline')) {
          if (node.attrs.inline === '' || node.attrs.inline) {
            inline = true
          }
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
      content += normalize(tree2html(node.content))

      // Parsing content
      const parsed = parse(content, md, node.tag, inline)

      // Converting tree to html content
      node.content = html2tree(parsed)

      return node
    })

    return tree
  }
}
