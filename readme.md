# PostHTML Plugin Boilerplate <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]
[![Coverage][cover]][cover-badge]
[![Standard Code Style][style]][style-url]

This plugin is for converting markdown to html using [markdown-it](https://github.com/markdown-it/markdown-it). (PS. This is my first plugin so go easy on me.)

Before:
``` html
<md class="lol" tag="section">
    # Heading 1
    ---

    Paragraph with some text

    *Italic*
    __Bold__

    - List item 1
    - List item 2
    - List item 3
</md>
```

After:
``` html
<section class="lol">
<h1>Heading 1</h1>
<hr>
<p>Paragraph with some text</p>
<p><em>Italic</em>
<strong>Bold</strong></p>
<ul>
<li>List item 1</li>
<li>List item 2</li>
<li>List item 3</li>
</ul>
</section>
```

------

Before:
```html
<markdown src="./README.md">
    # Imported
</markdown>
```

After:
```html
<div>
<!-- contents of README.md -->
<h1>Imported</h1>
</div>
```

All `src` paths should be relative to the root option passed in the plugin

## Install

> npm i posthtml posthtml-markdownit -D

## Usage

Options will be directly passed into markdown-it. This plugin calculates whitespaces based on 
the first indented text.

``` js
const fs = require('fs');
const posthtml = require('posthtml');
const markdown = require('posthtml-markdownit');

posthtml()
    .use(markdown({ /* options */ }))
    .process(html/*, options */)
    .then(result => fs.writeFileSync('./after.html', result.html));
```

## Options

- `root`: (default: `./`) Path for markdown files which are imported.
- `encoding`: (default: `utf-8`) Encoding for imported markdown files
- `markdownit`: (default: `{}`) Options passed into markdown-it
- `plugins`: (default: `[]`) Plugins for markdown-it. Example:
```js
markdown({
    plugins: [{
        plugin: require("markdown-it-emoji"),
        options: // Options for markdown-it-emoji
    }]
})
```

There are some basic examples in the test/fixtures directory.

### Contributing

See [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs) and [contribution guide](CONTRIBUTING.md).

### License [MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-markdownit.svg
[npm-url]: https://npmjs.com/package/posthtml-markdownit

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[build]: https://travis-ci.org/posthtml/posthtml.svg?branch=master
[build-badge]: https://travis-ci.org/posthtml/posthtml?branch=master

[cover]: https://coveralls.io/repos/posthtml/posthtml/badge.svg?branch=master
[cover-badge]: https://coveralls.io/r/posthtml/posthtml?branch=master
