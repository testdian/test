/*
 * @@description: 配置目录
 */
/**
 * @usage
 * 1. pnpm install swaggie-beta ts-node lodash --save-dev
 * 2. package.json add script
 */
const path = require('path');

// sdk_v2 去除请求函数名加入 tag 字段
const basePath = path.join(__dirname, '../src/sdks_v2/new');

export default {
  /** api 生成的文件夹根目录 */
  basePath,
  /** 模板文件目录 */
  templatePath: path.join(__dirname, './'),
  /** swagger json 文件的位置 */
  swaggerJsonUrls: [
    'https://dct-gateway-dev-internal.carbonstop.net/computation/v2/api-docs',
    'https://dct-gateway-dev-internal.carbonstop.net/system/v2/api-docs',
    'https://dct-gateway-dev-internal.carbonstop.net/footprint/v2/api-docs',
    'https://dct-gateway-dev-internal.carbonstop.net/supplychain/v2/api-docs',
    'https://dct-gateway-dev-internal.carbonstop.net/enterprisesystem/v2/api-docs',
    'https://dct-gateway-dev-internal.carbonstop.net/accountsystem/v2/api-docs',
  ],
  /** 需要替换的接口文件地址，eg.  baseURL: `${process.env.REACT_APP_API_URL}`,  */
  baseUrlReplaceString: 'baseURL: `${process.env.REACT_APP_API_URL}`,',
  /** 不要动 */
  matchFile: '.ts',
};
