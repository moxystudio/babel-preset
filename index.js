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
        // preset-env related options
        targets: ['browser', 'node'], // Can be an array with `browser` and `node` or a an object
        modules: 'commonjs', // Usually set to `commonjs` or `false`
        debug: false, // Enable debug mode for preset-env

        // other options
        env: process.env.BABEL_NODE || process.env.NODE_ENV || 'development',
        react: false, // Enable react
        addModuleExports: options == null || options.modules === 'commonjs', // Brings back https://github.com/babel/babel/issues/2212
        ...options,
    };

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
        // When on the browser, set the browser support to the same used by Google
        // See https://www.npmjs.com/package/browserslist-config-google
        // Otherwise, set the target to the version of Node.js that was used to compile
        targets: Array.isArray(options.targets) ? {
            ...options.targets.includes('node') ? { node: '8.9' } : {},
            ...options.targets.includes('browser') ? { browsers: ['extends browserslist-config-google'] } : {},
        } : options.targets,
    }]);

    // Add react support
    if (options.react) {
        addReactSupport(config, options);
    }

    config.plugins.push(
        // The two plugins above activate stage 3 features that babe hasn't added to the stage 3 preset yet
        // Allows class { handleClick = () => { } }
        require.resolve('babel-plugin-transform-class-properties'),
        // Support destructuring of objects, e.g.: { ...foo }
        [require.resolve('babel-plugin-transform-object-rest-spread'), { useBuiltIns: true }]
    );

    return config;
};
