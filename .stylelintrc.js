/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-01-10 12:31:06
 */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
  ].map(function (key) {
    return require.resolve(key);
  }),
  plugins: [
    'stylelint-less',
    'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties',
  ].map(function (key) {
    return require.resolve(key);
  }),
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'plugin/declaration-block-no-ignored-properties': true,
  },
};
