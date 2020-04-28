<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>posthtml-markdownit</h1>
  <p>Transform markdown using markdown-it</p>

  [![Version][npm-version-shield]][npm]
  [![License][license-shield]][license]
  [![Build][travis-ci-shield]][travis-ci]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Introduction

This plugin converts Markdown to HTML using [markdown-it](https://github.com/markdown-it/markdown-it).

Before:

```html
<markdown>
  # Heading 1
  ---

  Paragraph with some text

  *Italic*
  __Bold__

  - List item 1
  - List item 2
  - List item 3
</markdown>
```

After:

```html
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
```

## Install

```
$ npm i -D posthtml-markdownit
```

## Usage

```js
const posthtml = require('posthtml')
const markdown = require('posthtml-markdownit')

posthtml([
    markdown()
  ])
  .process('<markdown># Test</markdown>')
  .then(result => console.log(result.html))

  // <h1>Test</h1>
```

### Importing files

You can import and render Markdown files:

Before:

```html
<markdown src="./README.md">
  # Imported
</markdown>
```

After:

```html
<!-- contents of README.md here -->
<h1>Imported</h1>
```

## Syntax

### Tags

Both `<markdown>` and `<md>` tags are suported.

Before:

```html
<md>
  # Heading 1
</md>
```

After:

```html
<h1>Heading 1</h1>
```

By default, the tags are removed. See the [tag attribute](#tag) if you need a wrapping tag around your Markdown content.

### Attributes

You can also use `markdown` or `md` attributes on any element:

Before:

```html
<div md>
  # Heading 1
</div>
```

After:

```html
<h1>Heading 1</h1>
```

#### `tag`

You can use a `tag` attribute to wrap the resulting markup in a tag:

Before:

```html
<md tag="section">
  # Heading 1
</md>
```

After:

```html
<section>
  <h1>Heading 1</h1>
</section>
```

## Options

### `root`

Type: `string`\
Default: `./`

A path relative to which markdown files are [imported](#importing-files).

### `encoding`

Type: `string`\
Default: `utf8`

Encoding for imported Markdown files.

### `markdownit`

Type: `object`\
Default: `{}`

Options passed to markdown-it. See the [available options](https://github.com/markdown-it/markdown-it#init-with-presets-and-options).

### `plugins`

Type: `array`\
Default: `[]`

Plugins for markdown-it.

Example:

```js
markdown({
  plugins: [{
    plugin: require('markdown-it-emoji'),
    options: {} // Options for markdown-it-emoji
  }]
})
```

[npm]: https://www.npmjs.com/package/posthtml-markdownit
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-markdownit.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-markdownit
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-markdownit.svg
[travis-ci]: https://travis-ci.org/posthtml/posthtml-markdownit/
[travis-ci-shield]: https://img.shields.io/travis/posthtml/posthtml-markdownit/master.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-markdownit.svg
