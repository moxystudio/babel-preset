'use strict';

const addLodashSupport = (config, options) => {
    // Re-include default ids plus lodash/fp
    const baseLodashOptionsIds = [
        'lodash',
        'lodash-es',
        'lodash-compat',
        'lodash/fp',
    ];

    config.plugins.push([
        require.resolve('babel-plugin-lodash'),
        Object.assign(
            {},
            options,
            { id: baseLodashOptionsIds.concat(options.id || []) }
        ),
    ]);
};

module.exports = addLodashSupport;
