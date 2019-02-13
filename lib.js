'use strict';

const moduleTransformations = require('@babel/preset-env/lib/module-transformations').default;
const addDynamicImportSupport = require('./lib/dynamic-import');
const addReactSupport = require('./lib/react');
const addLodashSupport = require('./lib/lodash');

module.exports = (context, options) => {
    options = Object.assign({
        react: false,
        lodash: true,
        dynamicImport: true,
        modules: process.env.BABEL_ENV === 'es' ? false : 'commonjs', // Usually set to `commonjs` or `false`
        namedDefaultExport: null,
    }, options);
    if (options.modules !== 'commonjs' && options.modules !== 'cjs' && options.namedDefaultExport) {
        throw new Error('The `namedDefaultExport` option can only be enabled when `modules` is commonjs');
    }

    // Set `namedDefaultExport` default value based on `modules`
    if (options.namedDefaultExport == null) {
        options.namedDefaultExport = options.modules === 'commonjs';
    }

    const config = {
        presets: [],
        plugins: [],
    };

    // Activate modules transformation
    if (moduleTransformations[options.modules]) {
        config.plugins.push(`@babel/plugin-${moduleTransformations[options.modules]}`);
    }

    // The two plugins above activate stage 3 features that babel hasn't added to the stage 3 preset yet
    config.plugins.push(
        // Allows class { handleClick = () => { } static propTypes = { foo: PropTypes.string } }
        require.resolve('@babel/plugin-proposal-class-properties'),
        // Support destructuring of objects, e.g.: { ...foo }
        [require.resolve('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: true }]
    );

    // Adds dynamic import support
    if (options.dynamicImport) {
        addDynamicImportSupport(config, options.modules);
    }

    // Add react support without doing any development or production transformations
    if (options.react) {
        addReactSupport(config);
    }

    // Cherry-pick lodash modules for smaller bundles
    if (options.lodash) {
        addLodashSupport(config, options.lodash);
    }

    // Add `module.exports = default;`, see https://github.com/59naga/babel-plugin-add-module-exports
    if (options.namedDefaultExport) {
        config.plugins.push('babel-plugin-add-module-exports');
    }

    return config;
};
