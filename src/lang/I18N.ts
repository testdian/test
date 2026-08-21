/*
 * @@description:
 */
import type { Locale } from 'antd/es/locale';
import Ant_en_US from 'antd/es/locale/en_US';
import Ant_zh_CN from 'antd/es/locale/zh_CN';
import KiwiIntl from 'kiwi-intl';

import enUS from './en-US/index';
import zhCN from './zh-CN/index';

export enum LocaleType {
  'zhCN' = 'zh-CN',
  'enUS' = 'en-US',
}

export const serviceLangMap = {
  [LocaleType.zhCN]: 1,
  [LocaleType.enUS]: 2,
} as const;

export const serviceLangMapReverse: { [key: number]: LocaleType } = {
  1: LocaleType.zhCN,
  2: LocaleType.enUS,
};

export const initLocale = LocaleType.zhCN;
// 项目内国际化资源
const kiwiIntl = KiwiIntl.init(initLocale, {
  [LocaleType.zhCN]: zhCN,
  [LocaleType.enUS]: enUS,
});

// 组件库国际化资源
export const AntdLocale: {
  [key in LocaleType]: Locale;
} = {
  [LocaleType.zhCN]: Ant_zh_CN,
  [LocaleType.enUS]: Ant_en_US,
};

export default kiwiIntl as typeof kiwiIntl & {
  template: (str: string, args: object) => string;
};
