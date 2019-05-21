'use strict';

const babelCore = require('@babel/core');
const serializerPath = require('jest-serializer-path');
const preset = require('../end-project');

const env = process.env.NODE_ENV;

expect.addSnapshotSerializer(serializerPath);

afterEach(() => {
    process.env.NODE_ENV = env;
});

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

describe('loose', () => {
    it('should disable loose if options.loose is disabled', () => {
        expect(preset(null, { loose: true })).toMatchSnapshot();
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

describe('env', () => {
    it('should take into consideration process.env.NODE_ENV', () => {
        process.env.NODE_ENV = 'development';
        expect(preset(null, { react: true })).toMatchSnapshot();
        process.env.NODE_ENV = 'production';
        expect(preset(null, { react: true })).toMatchSnapshot();
    });
});

describe('dynamicImport', () => {
    it('should take into consideration options.dynamicImport', () => {
        expect(preset(null, { dynamicImport: false })).toMatchSnapshot();
    });
});

describe('functional', () => {
    describe('object-rest-spread', () => {
        it('should handle correctly', () => {
            expect(
                babelCore.transform(`
                    var z = { x, ...y };
                `, preset()).code
            ).toMatchSnapshot();
        });

        it('should handle correctly for target with support', () => {
            const targets = {
                chrome: '60',
            };

            expect(
                babelCore.transform(`
                    var z = { x, ...y };
                `, preset(null, { targets })).code
            ).toMatchSnapshot();
        });
    });

    describe('class-properties', () => {
        it('should handle correctly', () => {
            expect(
                babelCore.transform(`
                    class Bork {
                        static a = 'foo';
                        static b;
                    
                        x = 'bar';
                        y;
                    }
                `, preset()).code
            ).toMatchSnapshot();
        });
    });
});
