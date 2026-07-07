import globals from 'globals'
// we import the recomoded confog from eslint , to add to our custom one 
import js from '@eslint/js'

import stylisticJs from '@stylistic/eslint-plugin'

export default [
  // first element of the array is the recomended config , the secod is our custom one
  js.configs.recommended,
  {
    // we made it for all our js files
    files: ['**/*.js'],
    languageOptions: {
      // to show what libraries we are using , we preffered common js over ES6 ones 
      sourceType: 'commonjs',
      // to watch out for the variables of the backend (node) like : process ..
      // we do this so that eslint doesn t flag them undefined and recognises them
      globals: { ...globals.node },
      // to configure our linter to deal with latest ES without issues
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',// we don t want to be warned about console log so we remove the default rule
    },

  },
  {
    ignores: ['dist/**'],
  },
]