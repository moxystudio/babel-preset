'use strict';

function addReactSupport(config, options) {
    // Add base support
    config.plugins.unshift(
        require.resolve('babel-plugin-syntax-jsx'),
        [require.resolve('babel-plugin-transform-react-jsx'), { useBuiltIns: true }],
        require.resolve('babel-plugin-transform-react-display-name')
    );

    // Enable optimizations on production
    if (options.env === 'production') {
        config.plugins.push(
            require.resolve('babel-plugin-transform-react-remove-prop-types'),
            require.resolve('babel-plugin-transform-react-constant-elements'),
            require.resolve('babel-plugin-transform-react-inline-elements')
        );
    // The following two plugins are currently necessary to make React warnings include more valuable information.
    // They are included here because they are currently not enabled in babel-preset-react.
    // See the below threads for more info:
    // https://github.com/babel/babel/issues/4702
    // https://github.com/babel/babel/pull/3540#issuecomment-228673661
    // https://github.com/facebookincubator/create-react-app/issues/989
    } else {
        config.plugins.push(
            // Adds component stack to warning messages
            require.resolve('babel-plugin-transform-react-jsx-source'),
            // Adds __self attribute to JSX which React will use for some warnings
            require.resolve('babel-plugin-transform-react-jsx-self')
        );
    }
}

// -----------------------------------------------

module.exports = (context, options) => {
    options = {
        targets: ['browsers', 'node'], // Can be an array with `browsers` and/or `node` or an object
        modules: process.env.BABEL_ENV === 'es' ? false : 'commonjs', // Usually set to `commonjs` or `false`
        debug: false, // Enable debug mode for preset-env

        env: process.env.NODE_ENV || 'production',
        react: false,
        namedDefaultExport: null,
        ...options,
    };

    if (options.modules !== 'commonjs' && options.namedDefaultExport) {
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

    // The `preset-env` will activate the necessary features based on our targets
    // It's no longer necessary to add `es2015`, `es2016`, etc manually
    config.presets.push([require.resolve('babel-preset-env'), {
        // Replaces `import 'babel-polyfill';` with only the polyfills that are
        // actually required based on the targets
        useBuiltIns: true,
        // Produce less and more readable code (although not as faithful to the semantics)
        loose: true,
        // Print plugins & polyfills
        debug: options.debug,
        // Set modules options
        modules: options.modules,
        // Set the browser support to be the same used by Google (https://www.npmjs.com/package/browserslist-config-google)
        // Set Nodejs target to be the latest LTS
        targets: Array.isArray(options.targets) ? {
            ...options.targets.includes('node') ? { node: '8.9' } : {},
            ...options.targets.includes('browsers') ? { browsers: ['extends browserslist-config-google'] } : {},
        } : options.targets,
    }]);

    // Add react support
    if (options.react) {
        addReactSupport(config, options);
    }

    // The two plugins above activate stage 3 features that babel hasn't added to the stage 3 preset yet
    config.plugins.push(
        // Allows class { handleClick = () => { } static propTypes = { foo: PropTypes.string } }
        require.resolve('babel-plugin-transform-class-properties'),
        // Support destructuring of objects, e.g.: { ...foo }
        [require.resolve('babel-plugin-transform-object-rest-spread'), { useBuiltIns: true }]
    );

    // Add `module.exports = default;`, see https://github.com/59naga/babel-plugin-add-module-exports
    if (options.namedDefaultExport) {
        config.plugins.push('babel-plugin-add-module-exports');
    }

    return config;
};
