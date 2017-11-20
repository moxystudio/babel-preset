'use strict';

const serializerPath = require('jest-serializer-path');
const preset = require('..');

expect.addSnapshotSerializer(serializerPath);

it('should return a default config that target browsers and node', () => {
    expect(preset()).toMatchSnapshot();
});

it('should return a config for node if options.targets is set to node', () => {
    expect(preset(null, { targets: ['node'] })).toMatchSnapshot();
});

it('should return a config for node if options.targets is set to browser', () => {
    expect(preset(null, { targets: ['browsers'] })).toMatchSnapshot();
});

it('should allow overriding options.targets with an object', () => {
    expect(preset(null, { targets: { node: 'current' } })).toMatchSnapshot();
});

it('should disable modules if options.modules is disabled', () => {
    expect(preset(null, { modules: false })).toMatchSnapshot();
});

describe('react', () => {
    it('should enable react if options.react is enabled and enable development goodies', () => {
        expect(preset(null, { react: true })).toMatchSnapshot();
    });

    it('should enable react optimizations if env is production', () => {
        expect(preset(null, { env: 'production', react: true })).toMatchSnapshot();
    });
});
