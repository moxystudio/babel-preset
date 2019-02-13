'use strict';

const serializerPath = require('jest-serializer-path');
const preset = require('../lib');

expect.addSnapshotSerializer(serializerPath);

it('should have the right config with the default options', () => {
    expect(preset()).toMatchSnapshot();
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
    it('should enable react plugins if options.react is enabled and enable development goodies', () => {
        expect(preset(null, { react: true })).toMatchSnapshot();
    });

    it('should enable react optimizations if options.env is production', () => {
        expect(preset(null, { env: 'production', react: true })).toMatchSnapshot();
    });
});

describe('lodash', () => {
    it('should disable the lodash plugin if options.lodash is disabled', () => {
        expect(preset(null, { lodash: false })).toMatchSnapshot();
    });

    it('should pass any options to the lodash plugin', () => {
        expect(preset(null, { lodash: { id: 'recompose' } })).toMatchSnapshot();
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
        expect(preset(null, { modules: 'commonjs', namedDefaultExport: true })).toMatchSnapshot();
        expect(preset(null, { modules: 'cjs', namedDefaultExport: true })).toMatchSnapshot();
        expect(preset(null, { namedDefaultExport: false })).toMatchSnapshot();
        expect(preset(null, { modules: 'commonjs', namedDefaultExport: false })).toMatchSnapshot();
        expect(preset(null, { modules: 'cjs', namedDefaultExport: false })).toMatchSnapshot();
    });

    it('should throw when enabling options.namedDefaultExport and options.modules is not commonjs', () => {
        expect(() => preset(null, { modules: false, namedDefaultExport: true }))
        .toThrow('The `namedDefaultExport` option can only be enabled when `modules` is commonjs');
    });
});

describe('dynamicImport', () => {
    it('should respect options.modules and options.dynamicImport', () => {
        expect(preset(null, { modules: 'commonjs', dynamicImport: true })).toMatchSnapshot();
        expect(preset(null, { modules: 'cjs', dynamicImport: true })).toMatchSnapshot();
        expect(preset(null, { modules: false, dynamicImport: true })).toMatchSnapshot();
        expect(preset(null, { modules: 'foo', dynamicImport: true })).toMatchSnapshot();

        expect(preset(null, { modules: 'commonjs', dynamicImport: false })).toMatchSnapshot();
        expect(preset(null, { modules: 'cjs', dynamicImport: false })).toMatchSnapshot();
        expect(preset(null, { modules: false, dynamicImport: false })).toMatchSnapshot();
        expect(preset(null, { modules: 'foo', dynamicImport: true })).toMatchSnapshot();
    });
});
