module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ["plugin:import/errors", "plugin:import/warnings", "eslint:recommended", "plugin:react/recommended", "plugin:import/recommended", "plugin:import/typescript", "plugin:prettier/recommended", "plugin:@typescript-eslint/recommended", "eslint-config-prettier", "plugin:storybook/recommended", "plugin:eslint-plugin-react-hooks/recommended"],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ["react", "@typescript-eslint", "unused-imports", "import"],
    settings: {
        react: {
            pragma: "React",
            version: "detect"
        },
        "import/resolver": {
            "node": {
                "paths": ["src"],
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
    reportUnusedDisableDirectives: true,
    rules: {
        "react/jsx-key": "warn",
        "no-use-before-define": 0,
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "prettier/prettier": ["warn", {
            "endOfLine": "auto"
        }],
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/explicit-member-accessibility": 0,
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-use-before-define": 0,
        "@typescript-eslint/prefer-interface": 0,
        "@typescript-eslint/no-unused-expressions": ["warn"],
        "@typescript-eslint/no-unused-vars": ["warn"],
        "unused-imports/no-unused-imports": "warn",
        "react/react-in-jsx-scope": "off",
        "import/order": ["warn", {
            "alphabetize": {
                "order": "asc"
            },
            "newlines-between": "always",
            "pathGroups": [{
                "pattern": "react",
                "group": "builtin",
                "position": "before"
            }, {
                "pattern": "@tiller-ds/**",
                "group": "internal"
            }, {
                "pattern": "@nrich/**",
                "group": "internal"
            }],
            "pathGroupsExcludedImportTypes": ["react", "@tiller-ds/**"],
            "groups": ["builtin", "external", "internal", ["parent", "sibling"], "index"]
        }]
    }
};