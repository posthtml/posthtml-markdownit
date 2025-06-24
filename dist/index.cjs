'use strict';

const posthtmlRender = require('posthtml-render');
const posthtmlParser = require('posthtml-parser');
const MarkdownIt = require('markdown-it');
const minIndent = require('min-indent');
const node_path = require('node:path');
const node_fs = require('node:fs');
const api_js = require('posthtml/lib/api.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const MarkdownIt__default = /*#__PURE__*/_interopDefaultCompat(MarkdownIt);
const minIndent__default = /*#__PURE__*/_interopDefaultCompat(minIndent);

const normalize = (data) => {
  const indents = minIndent__default(data);
  if (indents !== 0) {
    const replaceRegex = new RegExp(`^[ \\t]{${indents}}`, "gm");
    return data.replace(replaceRegex, "");
  }
  return data;
};
const parse = (data, parser2, hasTag, inline) => {
  const parsed = inline ? parser2.renderInline(data) : parser2.render(data);
  return hasTag ? `
${parsed}` : parsed;
};
const importMarkdown = (src, settings) => {
  const from = node_path.resolve(settings.root, src);
  const content = node_fs.readFileSync(from, settings.encoding);
  return normalize(content);
};
const plugin = (options) => {
  const settings = {
    root: "./",
    encoding: "utf8",
    markdownit: {},
    plugins: [],
    ...options
  };
  const md = new MarkdownIt__default(settings.markdownit);
  for (const plugin2 of settings.plugins) {
    if (typeof plugin2.plugin === "string") {
      import(plugin2.plugin).then((loaded) => {
        plugin2.plugin = loaded.default || loaded;
        md.use(plugin2.plugin, plugin2.options || {});
      }).catch((error) => {
        throw error;
      });
    } else {
      md.use(plugin2.plugin, plugin2.options || {});
    }
  }
  return (tree) => {
    tree.match = tree.match || api_js.match;
    tree.match([
      { tag: "md" },
      { tag: "markdown" },
      { attrs: { md: "" } },
      { attrs: { markdown: "" } }
    ], (node) => {
      let inline = false;
      let content = "";
      if (["md", "markdown"].includes(node.tag)) {
        node.tag = false;
      }
      if (node.attrs) {
        if (node.attrs.tag) {
          node.tag = node.attrs.tag;
          delete node.attrs.tag;
        }
        if (Object.hasOwn(node.attrs, "inline")) {
          if (node.attrs.inline === "" || node.attrs.inline) {
            inline = true;
          }
        }
        for (const attribute of ["md", "markdown"]) {
          if (attribute in node.attrs) {
            delete node.attrs[attribute];
          }
        }
        const src = node.attrs.src || false;
        if (src) {
          content += importMarkdown(src, settings);
          if (tree.messages) {
            const from = node_path.resolve(settings.root, src);
            tree.messages.push({
              type: "dependency",
              file: from
            });
          }
          delete node.attrs.src;
        }
      }
      content += normalize(posthtmlRender.render(node.content));
      const parsed = parse(content, md, node.tag, inline);
      node.content = posthtmlParser.parser(parsed);
      return node;
    });
    return tree;
  };
};

module.exports = plugin;
