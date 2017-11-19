'use strict';

const serializerPath = require('jest-serializer-path');
const preset = require('..');

expect.addSnapshotSerializer(serializerPath);

it('should return a good default config', () => {
    expect(preset()).toMatchSnapshot();
});

it('should return a config for node if options.target is set to node', () => {
    expect(preset(null, { target: 'node' })).toMatchSnapshot();
});

it('should disable modules if options.modules is disabled', () => {
    expect(preset(null, { modules: false })).toMatchSnapshot();
});

describe('react', () => {
    it('should enable react if options.react is enabled', () => {
        expect(preset(null, { react: true })).toMatchSnapshot();
    });

    it('should enable react optimizations if env is production', () => {
        expect(preset(null, { env: 'production', react: true })).toMatchSnapshot();
    });
});
