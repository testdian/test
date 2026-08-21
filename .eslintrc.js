module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parser: '@typescript-eslint/parser', // 解析器
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    project: './tsconfig.json',
    // typescript-eslint specific options
    warnOnUnsupportedTypeScriptVersion: true,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
    'prettier',
    'unused-imports',
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended', //已完成修复
  ],
  rules: {
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index', 'unknown'],
        ],
        pathGroups: [
          {
            pattern: '@**/**',
            group: 'internal',
            position: 'after',
          },
        ],
      },
    ],
    // off or warning
    'import/no-mutable-exports': 'off',
    'react/function-component-definition': 'off',
    'no-restricted-globals': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/indent': 'off',
    // 代码格式化相关
    '@typescript-eslint/brace-style': 'off',
    // 函数必须定义返回类型
    ' @typescript-eslint/explicit-module-boundary-types': 'off',
    // 强制click和 onKeyUp, onKeyDown, onKeyPress 其中一个一同使用
    'jsx-a11y/click-events-have-key-events': 'off',
    // HTML 语义
    'jsx-a11y/no-static-element-interactions': 'off',
    // jsx 不允许使用扩展运算符
    'react/jsx-props-no-spreading': 'off',
    'react/destructuring-assignment': 'off',
    // 不允许 any
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    // 可选参数需要配置默认参数
    'react/require-default-props': 'off',
    // optional package
    'import/no-extraneous-dependencies': 'off',
    // promise then 2个参数 catch 1个参数
    '@typescript-eslint/no-floating-promises': 'off',
    'import/no-cycle': 'warn',
    'import/no-extraneous-dependencies': 'warn',
    'import/extensions': 'off',
    // 默认参数放置函数最后
    '@typescript-eslint/default-param-last': 'warn',
    // 以后要修复的
    // 变量命名问题
    '@typescript-eslint/naming-convention': 'warn',
    'no-debugger': 'warn',
    // 嵌套三元表达式
    'no-nested-ternary': 'warn',
    'no-plusplus': 'warn',
    'no-param-reassign': 'warn',
    // // 条件表达式不合适
    '@typescript-eslint/no-unused-expressions': 'warn',
    // // 相同的变量名已经在外层作用域定义
    '@typescript-eslint/no-shadow': 'warn',
    // // 变量使用在定义之前
    '@typescript-eslint/no-use-before-define': 'warn',
    'no-case-declarations': 'warn',
    // error
    '@typescript-eslint/no-unused-vars': 'error',
    // 注释右侧加一个空格
    'spaced-comment': ['warn', 'always'],
    'no-inline-comments': ['warn', { ignorePattern: 'webpackChunkName:\\s.+' }],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react',
            importNames: ['React'],
            message: '不要直接使用 React，eg。 import {memo} from "react"',
          },
        ],
      },
    ],
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['/*.js'],
};
