import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin'


/** @type {import('eslint').Linter.Config[]} */
export default [
  {ignores: [".config/", "dist/", "mongo.js", "eslint.config.mjs"]  },
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  stylistic.configs['recommended-flat'],
  pluginJs.configs.recommended,
  stylistic.configs.customize({
    flat: true, // required for flat config
    // the following options are the default values
    indent: 2,
    quotes: 'single',
    semi: false,
    // ...
  }),
  {rules: {
        eqeqeq: "error",
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ]        
      }
  }
];