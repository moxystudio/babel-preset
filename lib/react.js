'use strict';

const addReactSupport = (config, env) => {
    // Add base support
    config.plugins.unshift(
        require.resolve('@babel/plugin-syntax-jsx'),
        [require.resolve('@babel/plugin-transform-react-jsx'), { useBuiltIns: true }],
        require.resolve('@babel/plugin-transform-react-display-name')
    );

    // Enable optimizations on production
    if (env === 'production') {
        config.plugins.push(
            [require.resolve('babel-plugin-transform-react-remove-prop-types'), { removeImport: true }]
        );
    // The following two plugins are currently necessary to make React warnings include more valuable information.
    // They are included here because they are currently not enabled in babel-preset-react.
    // See the below threads for more info:
    // https://github.com/babel/babel/issues/4702
    // https://github.com/babel/babel/pull/3540#issuecomment-228673661
    // https://github.com/facebookincubator/create-react-app/issues/989
    } else if (env === 'development') {
        config.plugins.push(
            // Adds component stack to warning messages
            require.resolve('@babel/plugin-transform-react-jsx-source'),
            // Adds __self attribute to JSX which React will use for some warnings
            require.resolve('@babel/plugin-transform-react-jsx-self')
        );
    }
};

module.exports = addReactSupport;
