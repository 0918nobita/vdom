module.exports = {
    root: true,
    env: { browser: true, es6: true, node: true },
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    plugins: ['import', 'simple-import-sort', 'todo-plz'],
    rules: {
        'import/no-cycle': 'error',
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
                'plugin:import/typescript',
            ],
            plugins: ['@typescript-eslint'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                sourceType: 'module',
                project: './tsconfig.json',
            },
            rules: {
                '@typescript-eslint/array-type': [
                    'error',
                    { default: 'array-simple', readonly: 'array-simple' },
                ],
                '@typescript-eslint/consistent-type-imports': 'error',
                '@typescript-eslint/no-unnecessary-type-arguments': 'error',
            },
        },
    ],
};
