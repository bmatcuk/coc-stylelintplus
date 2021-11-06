[![Release](https://img.shields.io/npm/v/coc-stylelintplus.svg)](https://www.npmjs.com/package/coc-stylelintplus)

# coc-stylelintplus
coc-stylelintplus is an extension for [coc.nvim] that supports additional
features that coc-stylelint is missing. For example:

* Document formatting, like running `stylelint --fix` on the file.
* Commands to disable stylelint rules inline, above the line, for the entire
  file, or surrounding a block.

Formatting (ie, `stylelint --fix`) can be configured to run automatically on
save, in response to format requests, or run manually using a command.

coc-stylelintplus uses [stylelint-lsp] as the language server.

## Installation
With coc.nvim installed, run the following:

```viml
:CocInstall coc-stylelintplus
```

Alternatively, you can add the following to your init.vim and coc-stylelintplus
will be automatically installed the next time you start nvim:

```viml
let g:coc_global_extensions = ['coc-stylelintplus']
```

If you are using coc-stylelintplus with [coc-css], you'll want to disable
coc-css's validation in your coc-settings.json file, otherwise you'll get
duplicated or conflicting errors:

```json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "wxss.validate": false
}
```

coc-css still provides some useful functionality with validation disabled, so
it makes sense to use it together with coc-stylelintplus.

## Settings
* **stylelintplus.autoFixOnFormat** (default `false`) - automatically apply
  fixes in response to format requests.
* **stylelintplus.autoFixOnSave** (default `false`) - automatically apply fixes
  on save.
* **stylelintplus.config** (default `null`) - stylelint config to use.
* **stylelintplus.configFile** (default `null`) - path to stylelint config
  file.
* **stylelintplus.configOverrides** (default `null`) - stylelint config
  overrides.
* **stylelintplus.cssInJs** (default `false`) - Run stylelint on
  javascript/typescript files.
* **stylelintplus.enable** (default `true`) - if false, disable linting and
  auto-formatting.
* **stylelintplus.filetypes** (default see below) - Filetypes that
  coc-stylelintplus will lint.
* **stylelintplus.validateOnSave** (default `false`) - lint on save.
* **stylelintplus.validateOnType** (default `true`) - lint after changes.

If neither **config** nor **configFile** are specified, stylelint will attempt
to automatically find a config file based on the location of the file you are
editing.

If both **validateOnSave** and **validateOnType** are set to `false`, no
linting will occur but auto-fixes can still be applied if you have it enabled.
**validateOnSave** is automatically enabled if you enable **autoFixOnSave**
because revalidation must occur after fixes are applied. You may wish to
explicitly turn on **validateOnSave** if you are using another editor extension
that will make changes to the file on save, otherwise, diagnostic messages from
stylelint may be out-of-date after a save (ie, may point to the wrong line or
may have been fixed by the automatic changes on save, etc).

Default filetypes handled by coc-stylelintplus are css, less, postcss, sass,
scss, sugarss, vue, and wxss. This list can be overridden with the `filetypes`
option. If you enable the `cssInJs` option, javascript, javascriptreact,
typescript, and typescriptreact will be added to the list.

[coc-css]: https://github.com/neoclide/coc-css
[coc.nvim]: https://github.com/neoclide/coc.nvim
[stylelint-lsp]: https://github.com/bmatcuk/stylelint-lsp
