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

Babel preset to be used at MOXY.


## Installation

`$ npm install babel-preset-moxy --save-dev`


## Motivation

If you are developing a project that uses new ECMAScript language features and must work on the Browser, you have to transpile your code. This preset provides a shareable Babel config as a preset that should be used across those projects at MOXY.

- Compiles ES2015+ down to ES5 automatically based on targets (browsers/node) support by using [preset-env](https://www.npmjs.com/package/babel-preset-env)
- Enables [class-properties](https://www.npmjs.com/package/babel-plugin-transform-class-properties) (stage 3)
- Enables [object-rest-spread](https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread) (stage 3)
- Optionally enables React

Please note that **there's little reasons** to use Babel when you are developing a library that **targets only Node.js** because the latest stable and current versions support [99%](http://node.green/) of ES8 (this might change in the future). Though, if you really need to, consider adding [add-exports](https://github.com/59naga/babel-plugin-add-module-exports).


## Usage

```json
// .babelrc
{
    "presets": ["moxy"]
}
```

..or with options

```json
// .babelrc
{
    "presets": [
        ["moxy", { "react": true }]
    ]
}
```

Available options:

| Name   | Description   | Type     | Default |
| ------ | ------------- | -------- | ------- |
| env | The environment (`development`, `production` or `test`) | string | Based on `process.env` |
| targets | The output targets, see bellow for a more detailed explanation | Array/[Object](https://www.npmjs.com/package/babel-preset-env#targets) | ['browser', 'node']
| react | Adds support for [React](https://reactjs.org/) | boolean | false |
| modules | Transform ES6 module syntax to another module type | [string/boolean](https://www.npmjs.com/package/babel-preset-env#modules) | commonjs |

*NOTE:* `env`'s default value respects `process.env.BABEL_ENV` & `process.env.NODE_ENV` and falls back to `development` if none are set.


### `targets` option

The targets option has a very important role. By default, its value is `['browser', 'node']` which means that the compiled code will work in both the Browser and in Node.js.

When `browser` is specified, the compiled code will work on browsers that are supported by [Google's browser support policy](https://github.com/awkaiser/browserslist-config-google). When `node` is specified, the compiled code will work on the last LTS or higher (currently `v8.9`).

If you are developing a library or application that has different requirements in terms of browser or node support, you may specify the [targets](https://www.npmjs.com/package/babel-preset-env#targets) yourself as an object.


## Caveats

### Polyfills

#### For libraries

Shipping polyfills in libraries is, in general, a bad practice because it increases the overall file size of your app due to duplication.

The [transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) plugin attempts to solve the polyfills and duplication by transforming `Object.assign`, `Promise` and other features to their `core-js` counter-parts. Though, this doesn't play well with [preset-env](https://github.com/babel/babel-preset-env/tree/1.x/) because it inlines everything even if the features we are targeting are already supported by the browsers. Additionally, if different versions of the runtime are installed, duplication still happens.

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

Your minifier must support ES2015+ syntax because the outputted code might contain ES2015+ code.
For instance, if you are used to UglifyJS, you must use [uglify-es](https://www.npmjs.com/package/uglify-es).


## Tests

`$ npm test`   
`$ npm test -- --watch` during development


## License

[MIT License](http://opensource.org/licenses/MIT)
