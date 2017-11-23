# babel-preset-moxy

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

[npm-url]:https://npmjs.org/package/babel-preset-moxy
[npm-image]:http://img.shields.io/npm/v/babel-preset-moxy.svg
[downloads-image]:http://img.shields.io/npm/dm/babel-preset-moxy.svg
[travis-url]:https://travis-ci.org/moxystudio/babel-preset-moxy
[travis-image]:http://img.shields.io/travis/moxystudio/babel-preset-moxy/master.svg
[codecov-url]:https://codecov.io/gh/moxystudio/babel-preset-moxy
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/babel-preset-moxy/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/babel-preset-moxy
[david-dm-image]:https://img.shields.io/david/moxystudio/babel-preset-moxy.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/babel-preset-moxy?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/babel-preset-moxy.svg
[greenkeeper-image]:https://badges.greenkeeper.io/moxystudio/babel-preset-moxy.svg
[greenkeeper-url]:https://greenkeeper.io

[Babel](https://babeljs.io/) preset to be used at MOXY.


## Installation

`$ npm install babel-preset-moxy --save-dev`

You might need to also install `babel-cli` as a dev dependency.


## Motivation

If you are developing a project that uses new ECMAScript language features and must work on targets that do not yet support them, you have to transpile your code. This preset provides a shareable Babel config as a preset that should be used across those projects at MOXY.

- Compiles ES6+ down to ES5 based on targets (browsers/node) by using [preset-env](https://www.npmjs.com/package/babel-preset-env)
- Enables [class-properties](https://www.npmjs.com/package/babel-plugin-transform-class-properties) (stage 3)
- Enables [object-rest-spread](https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread) (stage 3)
- Optionally enables React
- Uses [add-module-exports](https://github.com/59naga/babel-plugin-add-module-exports) to get around [babel#2212](https://github.com/babel/babel/issues/2212)

Please note that **there are few reasons** to use Babel when you are developing a library that **only targets Node.js** because the latest LTS and current version support [99%](http://node.green/) of ES8.


## Usage

Create `.babelrc` at the root of your project:

```json
{
    "presets": ["moxy"]
}
```

...or with options:

```json
{
    "presets": [["moxy", { "react": true }]]
}
```

Set up your `package.json` like this:

```json
"main": "lib/index.js",
"module": "es/index.js",
"scripts": {
  "build:commonjs": "BABEL_ENV=commonjs babel src -d lib",
  "build:es": "BABEL_ENV=es babel src -d es",
  "build": "npm run build:commonjs && npm run build:es"
}
```

And finally create `src/index.js` and start coding!


Available options:

| Name   | Description   | Type     | Default |
| ------ | ------------- | -------- | ------- |
| env | The environment (`development`, `production` or `test`) | string | Based on `process.env.NODE_ENV` |
| targets | The output targets, see bellow for a more detailed explanation | Array/[Object](https://www.npmjs.com/package/babel-preset-env#targets) | ['browsers', 'node']
| react | Adds support for [React](https://reactjs.org/) | boolean | false |
| modules | Transform ES6 module syntax to another module type | [string/boolean](https://www.npmjs.com/package/babel-preset-env#modules) | Based on `process.env.BABEL_ENV` |
| namedDefaultExport | Use [add-module-exports](https://github.com/59naga/babel-plugin-add-module-exports) plugin to get around [babel/babel#2212](https://github.com/babel/babel/issues/2212) | boolean | true if modules is `commonjs` |

The `env`'s default value respects `process.env.NODE_ENV` and falls back to `production` if none are set. When env is `production`, some plugins that perform code optimization will be enabled.

The `modules` default value is `commonjs` unless `process.env.BABEL_ENV` is set to `es`.


### `targets` option

The targets option has a very important role. By default, its value is `['browsers', 'node']` which means that the compiled code will work in both the Browser and in Node.js.

When `browsers` is specified, the compiled code will work on browsers that are supported by [Google's browser support policy](https://github.com/awkaiser/browserslist-config-google). When `node` is specified, the compiled code will work on the last LTS or higher (currently `v8.9`).

If you are developing a library or application that has different requirements in terms of browser or node support, you may specify the [targets](https://www.npmjs.com/package/babel-preset-env#targets) yourself as an object.


## Caveats

### Polyfills

#### For libraries

Shipping polyfills in libraries is, in general, a bad practice because it increases the overall file size of your app due to duplication.

The [transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) plugin attempts to solve the polyfills and duplication by transforming `Object.assign`, `Promise` and other features to their [core-js](https://github.com/zloirock/core-js) counter-parts. Though, this doesn't play well with [preset-env](https://github.com/babel/babel-preset-env/tree/1.x/) because it inlines everything, including features that are already supported by our targets. Additionally, if different versions of the runtime are installed, duplication still happens.

For this reason, you, as an author, should state in the README of your library that you expect the environment to be polyfilled with [core-js](https://github.com/zloirock/core-js), [babel-polyfill](https://babeljs.io/docs/usage/polyfill/), [polyfill.io](https://polyfill.io/) or similar.

#### For applications

Simply include `import 'babel-polyfill';` or `import 'core-js';` at the top of your main app file.
Those statements will be replaced with the necessary polyfills based on node/browser support.

```js
// in:
import 'babel-polyfill';

// out:
import 'core-js/modules/es6.object.assign';
import 'core-js/modules/es6.promise';
// ...
```

#### Dynamic imports

This preset does not enable support for dynamic imports.

If you are only targeting Browsers and you are bundling your code with a bundler that recognizes dynamic import statements (e.g.: Webpack), you may want to activate [syntax-dynamic-import](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import).

If you are only targeting Node.js, you may want to use [dynamic-import-node]( https://www.npmjs.com/package/babel-plugin-dynamic-import-node) but beware that this won't work for browsers.

#### Minifying

You must use a minifier that understands ES6+ syntax because the transpiled code might contain ES6+ code.
As an example, UglifyJS v2 only understands ES5 syntax but [UglifyJS v3](https://www.npmjs.com/package/uglify-es) does support ES6+.


## Tests

`$ npm test`   
`$ npm test -- --watch` during development


## License

[MIT License](http://opensource.org/licenses/MIT)
