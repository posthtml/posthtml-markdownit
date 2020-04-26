let tree2html = require('posthtml-render')
let html2tree = require('posthtml-parser')
let MarkdownIt = require('markdown-it')

function parse (data, parser) {
  let dataSingleLines = data.split(/\r?\n/)
  let whitespaces = 0
  // Counting number of white spaces
  for (let line of dataSingleLines) {
    if (line.trim().length !== 0) {
      for (let spaces of line) {
        if (spaces !== ' ') break
        else whitespaces += 1
      }
      break
    }
  }

  for (let i in dataSingleLines) {
    dataSingleLines[i] = dataSingleLines[i].slice(whitespaces, dataSingleLines[i].length)
  }

  let normalized = dataSingleLines.join('\n')
  let markdown = parser.render(normalized)
  markdown = markdown.split(/\r?\n/)
  for (let line in markdown) {
    markdown[line] = ' '.repeat(whitespaces) + markdown[line]
  }
  let res = `\n${markdown.join('\n')}\n`
  return res
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
