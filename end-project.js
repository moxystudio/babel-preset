'use strict';

const path = require('path');
const addDynamicImportSupport = require('./lib/dynamic-import');
const addReactSupport = require('./lib/react');
const addLodashSupport = require('./lib/lodash');

module.exports = (context, options) => {
    options = Object.assign({
        react: false,
        lodash: true,
        dynamicImport: true,
        modules: process.env.BABEL_ENV === 'es' ? false : 'commonjs', // Usually set to `commonjs` or `false`
        targets: ['browsers', 'node'], // Can be an array with `browsers` and/or `node` or an object
        env: process.env.NODE_ENV || 'production',
    }, options);

    const config = {
        presets: [],
        plugins: [],
    };

    // The `preset-env` will activate the necessary features based on our targets
    // It's no longer necessary to add `es2015`, `es2016`, etc manually
    config.presets.push([require.resolve('@babel/preset-env'), {
        // This is required to suppress a warning in newer versions of babel
        corejs: 3,
        // Replaces `import 'babel-polyfill';` with only the polyfills that are
        // actually required based on the targets
        useBuiltIns: 'entry',
        // Produce less and more readable code (although not as faithful to the semantics)
        loose: true,
        // Set modules options
        modules: options.modules,
        // Set the browser support to be the same used by Google (https://www.npmjs.com/package/browserslist-config-google)
        // Set Nodejs target to be the latest LTS
        targets: Array.isArray(options.targets) ? Object.assign({},
            options.targets.indexOf('node') !== -1 ? { node: '8.9' } : {},
            options.targets.indexOf('browsers') !== -1 ? { browsers: ['extends browserslist-config-google'] } : {}
        ) : options.targets,
        // Enables support for builtin/feature proposals that have native support by the defined target environments
        shippedProposals: true,
    }]);

    // The plugins bellow activate stage 3 features that babel hasn't added to the stage 3 preset yet
    config.plugins.push(
        // Allows class { handleClick = () => { } static propTypes = { foo: PropTypes.string } }
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
    );

    config.plugins.push(['@babel/plugin-transform-runtime', {
        // We already have preset-env injecting the core-js polyfills automatically
        corejs: false,
        // Do not replace babel helpers with calls to moduleName
        helpers: false,
        // Automatically requires @babel/runtime/regenerator and avoid
        regenerator: true,
        // Choose whether to use ESModules or commonjs depending of the env
        useESModules: options.modules !== 'commonjs',
        // Use the @babel/runtime this package depends on
        absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json')),
    }]);

    // Adds dynamic import support
    if (options.dynamicImport) {
        addDynamicImportSupport(config, options.modules);
    }

    // Add react support
    if (options.react) {
        addReactSupport(config, options.env);
    }

    // Cherry-pick lodash modules for smaller bundles
    if (options.lodash) {
        addLodashSupport(config, options.lodash);
    }

    return config;
};
