/*
 * @@description: 命令执行脚本
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-11-29 15:28:23
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-01-11 14:32:58
 */

import * as _ from 'lodash-es';
import * as path from 'path';
import config from './configs';
import { getSpecifiedFiles, readFile, writeFile } from './file';

const { execSync } = require('child_process');

const { basePath, templatePath, swaggerJsonUrls } = config;

/** 控制台输出信息 */
const output = (msg: string) => {
  const writeLen = msg.length + 8 >= 20 ? 20 : msg.length + 8;
};

const generateSdkPath = (fullPath: string) => {
  const { pathname } = new URL(fullPath);
  return _.camelCase(pathname.replaceAll('/', ' '));
};

/** 生成sdk 文件 */
swaggerJsonUrls.forEach(url => {
  output(`generate sdk from ${url}`);
  const fileName = generateSdkPath(url);
  // ts-ignore
  execSync(
    `swaggie -s ${url}  -o ${path.join(
      basePath,
      fileName,
    )} -t ${templatePath} `,
  );
});

/** 读取sdk 文件, 清除不支持的符号类型 */
output(`remove »« ...`);
getSpecifiedFiles(config.basePath).forEach(filePath => {
  const fileContent = readFile(filePath);
  writeFile(
    filePath,
    fileContent
      // fix  AxiosPromise<ApiResult«Map«string,string»»>
      .replaceAll(/«([a-zA-Z]*)\,?([a-zA-Z]*)»/g, '$1$2')
      .replaceAll(/[»«]/g, '')
      .replaceAll('WAITING_REPLACED_BASE_URL', config.baseUrlReplaceString),
  );
});
// execSync(`find ${basePath} -type f -exec sed -i '' -e 's/[»«]//g' {} \;`);

output(`format files ....`);
execSync(`prettier ${basePath}/*.ts ${basePath}/**/*.ts --write`);
