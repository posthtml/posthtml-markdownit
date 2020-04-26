# PostHTML Plugin Boilerplate <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]
[![Deps][deps]][deps-url]
[![Build][build]][build-badge]
[![Coverage][cover]][cover-badge]
[![Standard Code Style][style]][style-url]
[![Chat][chat]][chat-badge]

This plugin is for converting markdown to html using [markdown-it](https://github.com/markdown-it/markdown-it). (PS. This is my first plugin so go easy on me.)

Before:
``` html
<md class="lol">
  # Markdown, Yeah!
  ---
  > Working !
</md>
```

After:
``` html
<div class="lol">
    <h1>Markdown, Yeah!</h1>
    <hr>
    <blockquote>
    <p>Working !</p>
    </blockquote>

</div>
```

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

All options are passed to markdown-it


### Contributing

See [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs) and [contribution guide](CONTRIBUTING.md).

### License [MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml.svg
[npm-url]: https://npmjs.com/package/posthtml

[deps]: https://david-dm.org/posthtml/posthtml.svg
[deps-url]: https://david-dm.org/posthtml/posthtml

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[build]: https://travis-ci.org/posthtml/posthtml.svg?branch=master
[build-badge]: https://travis-ci.org/posthtml/posthtml?branch=master

[cover]: https://coveralls.io/repos/posthtml/posthtml/badge.svg?branch=master
[cover-badge]: https://coveralls.io/r/posthtml/posthtml?branch=master


[chat]: https://badges.gitter.im/posthtml/posthtml.svg
[chat-badge]: https://gitter.im/posthtml/posthtml?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"
