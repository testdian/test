/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:39
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-01-30 18:19:10
 */
export default {
  '*.{ts,tsx,js,jsx}': [
    'prettier --write',
    'eslint --fix --quiet --rule "no-console: error" --rule "no-debugger:error"',
  ],
};
