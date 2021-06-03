module.exports = {
    root: true,
    env: { browser: true, es6: true, node: true },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    plugins: ['simple-import-sort', 'todo-plz'],
    rules: {
        'simple-import-sort/imports': 'error',
        'todo-plz/ticket-ref': ['error', { pattern: '#[0-9]+' }],
    },
    ignorePatterns: ['node_modules', 'lib'],
    overrides: [
        {
            files: ['**/*.ts'],
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'prettier',
            ],
            plugins: ['@typescript-eslint'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
    ],
};
