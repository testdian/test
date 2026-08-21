/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-01-11 19:57:05
 */
const { CracoAliasPlugin } = require('react-app-alias');
const CracoLessPlugin = require('craco-less');

console.log(
  (process.env.NODE_ENV = process.env.REACT_APP_ENV || 'development'),
);

module.exports = {
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://192.168.1.173:9901',
      },
      '/system': {
        target: 'http://192.168.1.173:9901',
      },
      '/file': {
        target: 'http://192.168.1.173:9901',
      },
    },
  },
  plugins: [
    { plugin: CracoLessPlugin },
    {
      plugin: CracoAliasPlugin,
      options: {
        source: 'tsconfig',
        baseUrl: './',
        tsConfigPath: './tsconfig.path.json',
      },
    },
  ],
};
