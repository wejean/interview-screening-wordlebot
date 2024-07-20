// jest.config.js

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest'
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.jest.json'
        }
    }
};
