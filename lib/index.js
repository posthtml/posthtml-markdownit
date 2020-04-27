const tree2html = require('posthtml-render')
const html2tree = require('posthtml-parser')
const MarkdownIt = require('markdown-it')
const minIndent = require('min-indent')

function parse (data, parser) {
  let normalized = data
  let indents = minIndent(data)

  // removing indents
  if (indents !== 0) {
    let replaceRegex = new RegExp(`^[ \\t]{${indents}}`, 'gm')
    normalized = normalized.replace(replaceRegex, '')
  }

  let parsed = parser.render(normalized)
  return `\n${parsed}`
}

module.exports = function (options) {
  let markdownParser = new MarkdownIt(options)
  return function (tree) {
    tree.match([{ tag: 'md' }, { tag: 'markdown' }], node => {
      if (node.attrs) {
        node.tag = node.attrs.changeTo ? node.attrs.changeTo : 'div'
        if (node.attrs.changeTo) delete node.attrs.changeTo
      } else { node.tag = 'div' }

      let content = tree2html(node.content)
      let parsed = parse(content, markdownParser)
      node.content = html2tree(parsed)
      return node
    })
    return tree
  }
}
