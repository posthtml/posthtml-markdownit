import { render } from 'posthtml-render';
import { parser } from 'posthtml-parser';
import MarkdownIt from 'markdown-it';
import minIndent from 'min-indent';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { match } from 'posthtml/lib/api.js';

const normalize = (data) => {
  const indents = minIndent(data);
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
  const from = resolve(settings.root, src);
  const content = readFileSync(from, settings.encoding);
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
  const md = new MarkdownIt(settings.markdownit);
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
    tree.match = tree.match || match;
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
        if (Object.prototype.hasOwnProperty.call(node.attrs, "inline")) {
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
            const from = resolve(settings.root, src);
            tree.messages.push({
              type: "dependency",
              file: from
            });
          }
          delete node.attrs.src;
        }
      }
      content += normalize(render(node.content));
      const parsed = parse(content, md, node.tag, inline);
      node.content = parser(parsed);
      return node;
    });
    return tree;
  };
};

export { plugin as default };
