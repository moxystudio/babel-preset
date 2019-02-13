'use strict';

const addDynamicImportSupport = (config, modules) => {
    if (modules === false) {
        config.plugins.push(require.resolve('@babel/plugin-syntax-dynamic-import'));
    } else if (modules === 'cjs' || modules === 'commonjs') {
        config.plugins.push(require.resolve('babel-plugin-dynamic-import-node'));
    }
};

module.exports = addDynamicImportSupport;
