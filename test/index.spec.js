'use strict';

const serializerPath = require('jest-serializer-path');
const preset = require('..');

expect.addSnapshotSerializer(serializerPath);

describe('targets', () => {
    it('should return a default config that target browsers and node', () => {
        expect(preset()).toMatchSnapshot();
    });

    it('should return a config for node if options.targets is set to node', () => {
        expect(preset(null, { targets: ['node'] })).toMatchSnapshot();
    });

    it('should return a config for browsers if options.targets is set to browsers', () => {
        expect(preset(null, { targets: ['browsers'] })).toMatchSnapshot();
    });

    it('should allow overriding options.targets with an object', () => {
        expect(preset(null, { targets: { node: 'current' } })).toMatchSnapshot();
    });
});

describe('modules', () => {
    it('should set modules to false if options.modules is disabled', () => {
        expect(preset(null, { modules: false })).toMatchSnapshot();
    });

    it('should set modules to false by default if BABEL_ENV is es', () => {
        process.env.BABEL_ENV = 'es';

        try {
            expect(preset(null)).toMatchSnapshot();
        } finally {
            delete process.env.BABEL_ENV;
        }
    });
});

describe('react', () => {
    it('should enable react if options.react is enabled and enable development goodies', () => {
        expect(preset(null, { react: true })).toMatchSnapshot();
    });

    it('should enable react optimizations if options.env is production', () => {
        expect(preset(null, { env: 'production', react: true })).toMatchSnapshot();
    });
});

describe('namedDefaultExport & babel-plugin-add-module-exports', () => {
    it('should enable add-module-exports by default', () => {
        expect(preset(null)).toMatchSnapshot();
    });

    it('should enable add-module-exports if options.modules is commonjs', () => {
        expect(preset(null)).toMatchSnapshot();
        expect(preset(null, { modules: 'commonjs' })).toMatchSnapshot();
    });

    it('should not enable add-module-exports if options.modules is not commonjs', () => {
        expect(preset(null, { modules: false })).toMatchSnapshot();
    });

    it('should respect options.namedDefaultExport', () => {
        expect(preset(null, { namedDefaultExport: true })).toMatchSnapshot();
        expect(preset(null, { namedDefaultExport: false })).toMatchSnapshot();
        expect(preset(null, { modules: 'commonjs', namedDefaultExport: true })).toMatchSnapshot();
        expect(preset(null, { modules: 'commonjs', namedDefaultExport: false })).toMatchSnapshot();
    });

    it('should throw when enabling options.namedDefaultExport and options.modules is not commonjs', () => {
        expect(() => preset(null, { modules: false, namedDefaultExport: true }))
        .toThrow('The `namedDefaultExport` option can only be enabled when `modules` is commonjs');
    });
});
