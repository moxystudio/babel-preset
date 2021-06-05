# babel-preset

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][build-status-image]][build-status-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/@moxy/babel-preset
[npm-image]:https://img.shields.io/npm/v/@moxy/babel-preset.svg
[downloads-image]:https://img.shields.io/npm/dm/@moxy/babel-preset.svg
[build-status-url]:https://github.com/moxystudio/babel-preset/actions
[build-status-image]:https://img.shields.io/github/workflow/status/moxystudio/babel-preset/Node%20CI/master
[codecov-url]:https://codecov.io/gh/moxystudio/babel-preset
[codecov-image]:https://img.shields.io/codecov/c/github/moxystudio/babel-preset/master.svg
[david-dm-url]:https://david-dm.org/moxystudio/babel-preset
[david-dm-image]:https://img.shields.io/david/moxystudio/babel-preset.svg
[david-dm-dev-url]:https://david-dm.org/moxystudio/babel-preset?type=dev
[david-dm-dev-image]:https://img.shields.io/david/dev/moxystudio/babel-preset.svg

[Babel](https://babeljs.io/) preset to be used at MOXY.

## Installation

```ssh
$ npm install @moxy/babel-preset @babel/core --save-dev
```

If you are using Jest for testing, you also need to install [`babel-jest`](https://github.com/facebook/jest/tree/master/packages/babel-jest):

```ssh
$ npm install babel-jest --save-dev
```

## Motivation

Projects developed at MOXY often use new JavaScript language features that may not be supported in the targets they will run. This preset provides a shareable Babel config that:

- Allows you to use the latest JavaScript features and transpile only what is not already supported by your targets, thanks to [`preset-env`](https://www.npmjs.com/package/babel-preset-env)
- Enables [`class-properties`](https://www.npmjs.com/package/@babel/plugin-proposal-class-properties)
- Optionally enables React, transforming JSX to standard JavaScript
- Uses [`add-module-exports`](https://www.npmjs.com/package/babel-plugin-add-module-exports) to get around [babel#2212](https://github.com/babel/babel/issues/2212)
- Enables [`babel-plugin-lodash`](https://www.npmjs.com/package/babel-plugin-lodash)


## Do I need to transpile?

There has been [discussion](https://github.com/parcel-bundler/parcel/pull/559#discussion_r161926651) in the community about libraries not being compiled, leaving all compilation efforts to top-level projects consuming them. This makes sense, since developers know what platforms their top-level project target and are able to compile their dependencies accordingly. Furthermore, library maintainers are constantly having to update their compilation options as new features are accepted into different stages of the specification, which creates significant and unnecessary overhead.

Problems arise, however, in libraries which target both Node.js and browser, or if non-standard JavaScript is being used, such as [proposals](https://github.com/tc39/proposals) or [JSX](https://reactjs.org/docs/introducing-jsx.html). In those situations, library authors are required to transpile their libraries code to offer `CommonJS` and `ES` module variants or to transform non-standard JavaScript to standard JavaScript.

**In conclusion**:

1. For libraries, you need to transpile if you want to publish both in CommonJS and ES or if there are non-standard JavaScript language features being used
2. For top-level projects, you need to transpile both your code and your dependencies if the JavaScript language features being used are not supported by your targets

## Usage

### 1. Choose a preset-type

There're two preset types available for you to use:

- For libraries: use the `lib` type in case you are developing a library to be consumed by others
- For end-projects: use the `end-project` type in case you developing a top-level project, such as an Web Application, a Node.js API or CLI

### 2. Setup babel within your project

The way Babel is configured depends on the the tooling you are using. Below, there are instructions for common scenarios:

#### Standard project

> If you don't use a bundler within your project, this is the setup guide you should follow

- Create `.babelrc.json` at the root of your project, replacing `<preset-type>` with the preset type you chose:

    ```json
    {
        "presets": ["@moxy/babel-preset/<preset-type>"]
    }
    ```

    ...or with options:

    ```json
    {
        "presets": [["@moxy/babel-preset/<preset-type>", { "react": true }]]
    }
    ```

- Install [`@babel/cli`](https://www.npmjs.com/package/@babel/cli) as a dev dependency because we will need it for the build script:

    ```ssh
    $ npm install @babel/cli --save-dev
    ```

- Set up your `package.json` like this:

    ```json
    "main": "lib/index.js",
    "module": "es/index.js",
    "files": [
      "lib",
      "es"
    ],
    "scripts": {
      "build:commonjs": "BABEL_ENV=commonjs babel src -d lib --delete-dir-on-start",
      "build:es": "BABEL_ENV=es babel src -d es --delete-dir-on-start",
      "build": "npm run build:commonjs && npm run build:es"
    }
    ```

    Note that the build process above will produce both CommonJS and ES builds. If you just want to produce a single build, the `package.json` may be simplified. For example, to produce a single CommonJS build:

    ```json
    "main": "lib/index.js",
    "files": [
      "lib"
    ],
    "scripts": {
      "build": "BABEL_ENV=commonjs babel src -d lib --delete-dir-on-start"
    }
    ```
- Tweak your `.gitignore` file:

   Add `lib/` and/or `es/` folder to the gitignore file so that those output folders are never committed.

- Create `src/index.js` and happy coding!

#### Webpack based project

Tweak your Webpack config JavaScript rule to include [`babel-loader`](https://www.npmjs.com/package/babel-loader) and MOXY's preset. Here's an example for a website project using React:

```js
{
    test: /\.js$/,
    use: [
        {
            loader: require.resolve('babel-loader'),
            options: {
                cacheDirectory: true,  // Improve performance
                presets: [
                    [require.resolve('@moxy/babel-preset/end-project'), {
                        targets: ['browsers'],
                        react: true,
                        modules: false,
                    }],
                ],
            },
        },
    ],
}
```

It's important that you do not exclude the `node_modules` folder so that everything goes through the `@babel/preset-env`, ensuring that all the produced code was transpiled according to the targets.

### 3. Tweak the options

Below, you may find a list containing all options you may tweak:

| Name   | Description   | Type     | Default | in `lib` | in `end-project` |
| ------ | ------------- | -------- | ------- | ------------ | ------------ |
| react | Adds support for [React](https://reactjs.org/) | boolean | false | ✅ | ✅ |
| lodash | Transform to cherry-pick Lodash modules | boolean/[Object](https://github.com/lodash/babel-plugin-lodash#usage) | true | ✅ | ✅ |
| modules | Transform ES6 module syntax to another module type | [string/boolean](https://www.npmjs.com/package/babel-preset-env#modules) | Based on `process.env.BABEL_ENV`, `commonjs` if unspecified | ✅ | ✅ |
| dynamicImport | Adds support for `import()` statements | boolean | true | ✅ | ✅ |
| loose | Enable "loose" transformations for any plugins that allow them | boolean | true | ❌ | ✅ |
| targets | The output targets, see bellow for a more detailed explanation | Array/[Object](https://babeljs.io/docs/en/next/babel-preset-env.html#targets) | ['browsers', 'node'] | ❌ | ✅ |
| env | The environment (`development`, `production` or `test`) | string | Based on `process.env.NODE_ENV` | ❌ | ✅ |
| namedDefaultExport | Use [add-module-exports](https://github.com/59naga/babel-plugin-add-module-exports) plugin to get around [babel/babel#2212](https://github.com/babel/babel/issues/2212) | boolean | true if modules is `commonjs` | ✅ | ❌ |

#### `lodash` option

Specify which modules will have the cherry-pick transformation applied.

Note that `lodash-es`, `lodash-compat` and `lodash/fp` are always added for you, regardless of having this option defined or not.

For instance, to have smaller bundles when using [recompose](https://github.com/acdlite/recompose):

```json
{
    "presets": [
        ["@moxy/babel-preset/<preset-type>", {
            "lodash": { "id": ["recompose"] }
        }],
    ],
}
```

#### `targets` option

The targets option has a very important role. By default, its value is `['browsers', 'node']` which means that the compiled code will work in both the Browser and in Node.js.

When `browsers` is specified, the compiled code will work on browsers that are supported by [Google's browser support policy](https://github.com/awkaiser/browserslist-config-google) (modern). When `node` is specified, the compiled code will work on the last LTS or higher (currently `v8.9`).

If your project has different requirements in terms of browser or node support, you may specify the [targets](https://www.npmjs.com/package/babel-preset-env#targets) yourself as an object.

#### `dynamicImport` option

Dynamic imports support are enabled by default but are dependent on the `modules` option. More specifically, the [`syntax-dynamic-import`](https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import) and [`dynamic-import-node`](https://www.npmjs.com/package/babel-plugin-transform-dynamic-import) when the `modules` option is set to `false` and `commonjs` respectively.

For other `modules` types, such as `amd`, you must find and include a plugin yourself. Also, you may disable the `dynamicImport` option by setting it to `false` in case you want to disable the feature completely or if you want to choose another plugin.

#### `env` option

The `env`'s default value respects `process.env.NODE_ENV` and falls back to `production` if none are set. When env is `production`, some plugins that perform code optimization will be enabled.

The `modules` default value is `commonjs` unless `process.env.BABEL_ENV` is set to `es`.


### 4. Be aware of the caveats

No, seriously. Read the [Caveats](#caveats) section as it contains crucial information and might require you to do a few more steps.

## Caveats

### Polyfills

#### In libraries

Shipping polyfills in libraries is, in general, a bad practice because it increases the overall file size of your top-level project due to duplication.

The [`transform-runtime`](https://www.npmjs.com/package/babel-plugin-transform-runtime) plugin attempts to solve the polyfills and duplication by transforming `Object.assign`, `Promise` and other features to their [`core-js`](https://github.com/zloirock/core-js) counter-parts. Though, this doesn't play well with [`preset-env`](https://github.com/babel/babel-preset-env/tree/1.x/) because it inlines everything, including features that are already supported by our targets. Additionally, if different versions of the runtime are installed, duplication still happens.

For this reason, you, as an author, should state in the README of your library that you expect the environment to be polyfilled with [`core-js`](https://github.com/zloirock/core-js), [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/), [`polyfill.io`](https://polyfill.io/) or similar.

#### In top-level projects

Simply include `import 'babel-polyfill';` at the top of your entry file. That statement will be replaced with the necessary polyfills based on the targets you want to support.

```js
// in:
import 'babel-polyfill';

// out:
import 'core-js/modules/es6.object.assign';
import 'core-js/modules/es6.promise';
// ...
```

### Dynamic imports

The support for dynamic imports is enabled by default, please read more on the [`dynamicImport` option](#dynamicImport).

The caveat is that [`preset-env`](https://www.npmjs.com/package/babel-preset-env) is unaware that using `import()` with Webpack relies on Promise internally. Environments which do not have builtin support for Promise, like Internet Explorer, will require both the promise and iterator polyfills be added manually. Having said that, tweak your top-level project's Webpack config like so:

```js
{
    entry: [
        'core-js/modules/es6.promise',
        'core-js/modules/es6.array.iterator',
        // Path to your entry file
    ],
};
```

### Minifying

You must use a minifier that understands ES6+ syntax because the transpiled code might contain ES6+ code.
As an example, UglifyJS v2 only understands ES5 syntax but [UglifyJS v3](https://www.npmjs.com/package/uglify-es) does support ES6+.

## Tests

```sh
$ npm test
$ npm test -- --watch # during development
```

## License

[MIT License](http://opensource.org/licenses/MIT)
