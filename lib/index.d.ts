import type {Options as MarkdownItOptions, PluginWithOptions} from 'markdown-it';

export type MarkdownConfig = {
  /**
  Path relative to which markdown files are imported.

  @default './'
  */
  root?: string;

  /**
  Encoding for imported Markdown files.

  @default 'utf8'
  */
  encoding?: string;

  /**
  Options to pass to the `markdown-it` library.

  @default {}
  */
  markdownit?: MarkdownItOptions;

  /**
  Plugins for the `markdown-it` library.

  @default []
  */
  plugins?: Array<PluginWithOptions<unknown>>;
};
