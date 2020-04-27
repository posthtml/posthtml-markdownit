const tree2html = require('posthtml-render')
const html2tree = require('posthtml-parser')
const MarkdownIt = require('markdown-it')
const minIndent = require('min-indent')
const indentString = ' '

function parse (data, parser) {
  let normalized = data
  let indents = minIndent(data)

  // removing indents
  if (indents !== 0) {
    let replaceRegex = new RegExp(`^[ \\t]{${indents}}`, 'gm')
    normalized = normalized.replace(replaceRegex, '')
  }

  let parsed = parser.render(normalized)
  if (indents !== 0) {
    let output = parsed.replace(/^(?!\s*$)/gm, indentString.repeat(indents))
    return `\n${output}`
  } else {
    return `\n${parsed}`
  }
}

module.exports = function (options) {
  let markdownParser = new MarkdownIt(options)
  return function (tree) {
    tree.match([{ tag: 'md' }, { tag: 'markdown' }], node => {
      node.tag = 'div'
      let content = tree2html(node.content)
      let parsed = parse(content, markdownParser)
      node.content = html2tree(parsed)
      return node
    })
    return tree
  }
}
