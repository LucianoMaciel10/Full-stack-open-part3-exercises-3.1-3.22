import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { 
    files: ['**/*.js'], 
    languageOptions: { sourceType: 'commonjs' } 
  },
  { 
    languageOptions: { globals: globals.node } 
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylistic,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    },
    ignores: ['dist/**/*'],
  }
]
