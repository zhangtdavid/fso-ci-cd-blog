import globals from 'globals'
import eslint from '@eslint/js'
import stylisticPlugin from '@stylistic/eslint-plugin-js'


export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions:
    {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaVersion: 'latest' },
    },
  },
  { plugins: {
    ['@stylistic/js']: stylisticPlugin,
  }
  },
  eslint.configs.recommended,
  {
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': [
        'error'
      ],
      'no-trailing-spaces': [
        'error'
      ],
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'arrow-spacing': [
        'error',
        { 'before': true, 'after': true }
      ],
      'no-console': 0
    }
  },
  {
    ignores: ['dist', 'frontend'],
  }
]
