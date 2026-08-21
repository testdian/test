import { MenuProps, message } from 'antd';
import { MessageInstance, NoticeType } from 'antd/es/message/interface';
import { ColumnType, ColumnsType } from 'antd/es/table';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { compact, has, omit } from 'lodash-es';
import { useEffect, useRef } from 'react';

// import { FactorGasRes } from '@/sdks/systemV2ApiDocs';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { culHistory } from '@/views/supplyChainCarbonManagement/utils';

import { noValueBackTextRender } from './noValueBackText';
import I18N from '../lang/I18N';

const { edit } = PageTypeInfo;

type Options = {
  label: string | number;
  value: string | number;
  children?: Options[];
};

export type FactorUnitMTransformMap = {
  [k: string]: Options;
};

export type Dicts = {
  dictLabel: string;
  dictValue: string;
  sourceType: string;
  dictSort: number;
  id: null;
  sourceName: null | string;
  relatedValue: null | string;
  dictType: string;
};

/** 语言类型 */
export const LANG_TYPE = {
  /** 中文 */
  ZH: 1,
  /** 英文 */
  EN: 2,
};

const { ZH, EN } = LANG_TYPE;

/** 语言对应的字段后缀 */
const LANG_SUFFIX = {
  [ZH]: 'Zh',
  [EN]: 'En',
};

/** 接口返回来的languageSourceList类型 */
export interface ApiLanguageSourceList {
  id: number;
  langType: number;
  langType_name: string;
  sourceType: number;
  sourceType_name: string;
  sourceValue: string;
}

/** 处理多语言字段方法的参数 */
interface HandleLangFieldsProps {
  /** 原始数据 */
  rawData: { [key: string]: any };
  /** 语言 */
  langType: number | number[];
  /** 基准字段sourceType对照值 传进来是防止不同模块字段名一样*/
  sourceTypeMapping: { [key: string]: any };
  /** 接口返回来的languageSourceList */
  apiLanguageSourceList?: ApiLanguageSourceList[];
}

/**
 * @description 处理多语言字段-保存
 * @param rawData 原始数据
 * @param langType 语言
 * @param sourceTypeMapping 基准字段sourceType对照值 传进来是防止不同模块字段名一样
 * @param apiLanguageSourceList 接口返回来的languageSourceList
 * @returns 处理后的languageSourceList
 */
export const handleLangFields = ({
  rawData,
  langType,
  sourceTypeMapping,
  apiLanguageSourceList,
}: HandleLangFieldsProps) => {
  const langTypes = Array.isArray(langType) ? langType : [langType];

  const languageSourceList = langTypes?.flatMap(currentLangType => {
    /** 需要处理的语言对应的字段后缀名 */
    const langSuffix = LANG_SUFFIX?.[currentLangType] || 'En';

    /** 需要处理的语言字段名数组 */
    const langFieldsArr = Object.keys(rawData)?.filter(key =>
      key.endsWith(langSuffix),
    );

    /** 过滤需要的语言languageSourceList */
    const currentApiLanguageSourceList = apiLanguageSourceList?.filter(
      list => list.langType === currentLangType,
    );

    /** 对应的id-详情返回有id */
    const idArr = currentApiLanguageSourceList?.reduce(
      (arr: { [key: number]: number }, current) => {
        arr[current.sourceType] = current?.id;
        return arr;
      },
      {},
    );

    return langFieldsArr?.map(key => {
      /** 基准字段名 */
      const baseKey = key?.replace(langSuffix, '');
      /** sourceType值 */
      const sourceType = sourceTypeMapping?.[baseKey] as number;
      return {
        langType: currentLangType,
        sourceType,
        sourceValue: rawData?.[key],
        id: idArr?.[sourceType],
      };
    });
  });

  return languageSourceList;
};

/**
 * @description 反处理多语言字段-生成对象
 * @param languageSourceList 接口返回来的languageSourceList
 * @returns 处理后的对象
 */
export const reverseHandleLangFields = (
  languageSourceList: ApiLanguageSourceList[],
) => {
  if (Array.isArray(languageSourceList)) {
    return languageSourceList?.reduce((acc, current) => {
      const langSuffix = LANG_SUFFIX?.[current.langType] || 'En';
      const fieldName = `${current.sourceType_name}${langSuffix}`;
      acc[fieldName] = current.sourceValue;
      return acc;
    }, {} as { [key: string]: string });
  }
  return {};
};

/** 分母单位转换成联级数据结构 */
export const changeFactorM2cascaderOptions = (factorUnitM: Dicts[]) => {
  const factorMap: FactorUnitMTransformMap = {};
  factorUnitM.forEach(val => {
    if (val.sourceType && factorMap[val.sourceType]) {
      // @ts-ignore
      factorMap[val.sourceType].children = factorMap[
        val.sourceType
      ].children?.concat?.([
        { label: val.dictLabel, value: val.dictValue, children: [] },
      ]);
    } else if (val.sourceType) {
      factorMap[val.sourceType] = {
        label: val.sourceName || val.sourceType,
        value: val.sourceType,
        children: [
          {
            label: val.dictLabel,
            value: val.dictValue,
          },
        ],
      };
    }
  });
  return compact(Object.values(factorMap)).flat();
};

export type AssessmentMapOptions = {
  label: string | number;
  value: string | number;
  unit?: string | null;
  children?: AssessmentMapOptions[];
};
export type AssessmentMap = {
  [k: string]: AssessmentMapOptions;
};
/** 处理评价方法 */
export const handleAssessmentProposalOptions = (
  assessmentProposal: Dicts[],
) => {
  const assessmentMap: AssessmentMap = {};
  assessmentProposal.forEach(val => {
    if (val.sourceType && assessmentMap[val.sourceType]) {
      assessmentMap[val.sourceType].children = assessmentMap[
        val.sourceType
      ].children?.concat?.([
        {
          label: val.dictLabel,
          value: `${val.sourceType},${val.dictValue}`,
          unit: val.relatedValue,
        },
      ]);
    } else if (val.sourceType) {
      assessmentMap[val.sourceType] = {
        label: val.sourceName || val.sourceType,
        value: val.sourceType,
        children: [
          {
            label: val.dictLabel,
            value: `${val.sourceType},${val.dictValue}`,
            unit: val.relatedValue,
          },
        ],
      };
    }
  });
  return compact(Object.values(assessmentMap)).flat();
};

/**
 * @description 转换成科学记数法
 * @param value 原始值
 * @param needHandleDecimal 不满足科学记数法是否需要走有效位数的逻辑
 * @returns 处理后的值 string
 */
export const formatScientific = (
  value?: number | string,
  needHandleDecimal = false,
) => {
  if (value === 0 || value === '0') return '0';

  if (!value) return '-';

  /** 符号 */
  const sign = Number(value) < 0 ? '-' : '';

  const absValue = Math.abs(Number(value));
  const needsScientific =
    absValue >= 100000 || (absValue < 0.0001 && absValue > 0);

  /** 需要科学记数法 */
  if (needsScientific) {
    const exponent = Math.floor(Math.log10(absValue));
    const mantissa = (absValue / 10 ** exponent).toFixed(2);
    return `${sign}${mantissa}E${exponent}`;
  }

  /** 不符合科学记数法规则时需要处理有效位数 */
  if (needHandleDecimal) {
    const [integerPart, decimalPart] = value.toString().split('.');

    /** 当整数部分大于等于1或小于等于-1时，保留两位小数 */
    if (Number(integerPart) >= 1 || Number(integerPart) <= -1) {
      return Number(value).toFixed(2);
    }

    /** 当大于-1小于0或大于0小于1时，从第一位非0小数开始保留后续共三位小数，末尾四舍五入 */
    // 处理整数部分为 0 的情况
    if (decimalPart) {
      /** 有效小数 */
      let significantDecimals = '';

      // 查找第一位非 0 小数的位置
      const nonZeroIndex = decimalPart?.search(/[^0]/);

      if (nonZeroIndex !== -1) {
        /** 从第一位非 0 小数开始截取四位位，并进行四舍五入 */
        // eslint-disable-next-line prefer-destructuring
        significantDecimals =
          (
            Math.round(
              Number(
                `0.${decimalPart?.slice(nonZeroIndex, nonZeroIndex + 4)}`,
              ) * 1000,
            ) / 1000
          )
            .toString()
            .split('.')[1] || '';

        /** 确保保留三位有效小数 不够补充0 */
        if (significantDecimals && significantDecimals?.length < 3) {
          significantDecimals = significantDecimals?.padEnd(3, '0');
        }

        /** 无效0 */
        const zeroString = decimalPart.slice(0, nonZeroIndex);

        return `${sign}0.${zeroString}${significantDecimals}`;
      }

      return value.toString();
    }
  }

  return value.toString();
};

/** 获取导入页面的返回页面URL */
export const getImportReturnUrl = (importType: '1' | '2' | '4') => {
  const returnUrl = {
    /** 供应链商户导入-商户列表 */
    '1': SccmRouteMaps.sccmManagement,
    /** 供应链采购产品导入-采购产品列表 */
    '2': SccmRouteMaps.sccmProdct,
    /** 导入清单-清单分析编辑 */
    '4': LCARouteMaps.lcaModelInfo.replace(':pageTypeInfo', `${edit}`),
  };
  return returnUrl?.[importType] || '';
};

export type JointContent = MessageInstance['info'] extends (
  arg: infer T,
  ...a: any
) => any
  ? T
  : never;

export const Toast = (
  type: NoticeType,
  content: JointContent,
  duration?: number | VoidFunction, // Also can use onClose directly
  onClose?: VoidFunction,
) => {
  message[type](content, duration, onClose);
};
/**
 * @description column ellipsis
 */
export const addEllipsisToColumn = <T>(
  columns: ColumnType<T>[],
  dealFn?: (c: ColumnType<T>) => boolean,
): ColumnType<T>[] =>
  columns.map(c => ({ ...c, ellipsis: dealFn?.(c) ?? true }));

const keyStr = 'g98uezzumgv2wsbs';

const AESKey = CryptoJS.enc.Utf8.parse(keyStr);

const AESOptions = {
  mode: CryptoJS.mode.CBC,
  iv: CryptoJS.enc.Utf8.parse('qwe1231231231231'),
  padding: CryptoJS.pad.Pkcs7,
};

/**
 * @description 数据加密 aes
 * 接口数据加密后 key 统一为 requestData
 */
export const encrypt = (msg: string): string => {
  const srcs = CryptoJS.enc.Utf8.parse(msg);
  const result = CryptoJS.AES.encrypt(srcs, AESKey, AESOptions);
  const base64 = CryptoJS.enc.Base64;
  return result.ciphertext.toString(base64);
};

/**
 * @description 解密
 */
export const deCrypt = <T = string>(msg: string): T => {
  const de = CryptoJS.AES.decrypt(msg, AESKey, AESOptions);

  // eslint-disable-next-line
  // @ts-ignore
  return CryptoJS.enc.Utf8.stringify(de);
};

/** 获取URL中的search字段 */
export const getSearchParams = <SearchParams = Record<string, string>>() => {
  const search = new URLSearchParams(window.location.search);
  const result = Object.fromEntries(search.entries()) as SearchParams;

  return [result, search] as const;
};
/**
 *
 * @param obj search 参数
 * @param keepOldSearch  是否保留原有的search字段 default FALSE 不保留
 */
export function updateUrl(obj?: Record<string, any>, keepOldSearch?: boolean) {
  const { search, pathname, hash } = window.location;
  let searchObj = new URLSearchParams(search);
  // 默认保留原有的search
  if (!obj || !keepOldSearch) searchObj = new URLSearchParams();
  Object.keys(obj || {}).forEach(key => {
    const value = obj?.[key] || '';
    if (typeof value === 'string' || typeof value === 'number')
      searchObj.set(key, `${value}`);
    else searchObj.set(key, JSON.stringify(value));
  });

  const searchStr = searchObj.toString() ? `?${searchObj.toString()}` : '';
  const newUrl = pathname + searchStr + hash;
  // 向当前url添加参数，没有历史记录
  window.history.replaceState(
    Object.fromEntries(searchObj.entries()),
    '',
    newUrl,
  );
}

/**
 * // fixme 这里类型有问题
 * 将表单字段值改为安全值
 * remove null NaN
 * @param val (object | 基础类型 「不对 array 做处理」) 表单数据
 */

export const keepFormValueSafe = <SafeVal = any>(
  val: any,
  safeVal?: any,
): SafeVal => {
  const usedSafeVal = safeVal || undefined;
  // 空值处理
  if ([NaN, null].includes(val)) return usedSafeVal as SafeVal;
  // object 空值处理
  const res = {} as SafeVal;
  if (typeof val === 'object') {
    Object.keys(val).forEach(key => {
      // @ts-ignore
      res[key] = keepFormValueSafe(val[key], usedSafeVal);
    });

    return res;
  }
  return val as SafeVal;
};

export const chineseNumber = {
  small: [
    I18N.utils.zero,
    I18N.utils.one,
    I18N.utils.two,
    I18N.utils.three,
    I18N.utils.four,
    I18N.utils.five,
    I18N.utils.six,
    I18N.utils.seven,
    I18N.utils.eight,
    I18N.utils.nine,
    I18N.utils.ten,
  ],
  upper: ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
};

export const chineseNumberUnit = {
  small: [
    '亿',
    '万',
    '千',
    '百',
    '十',
    '亿',
    '万',
    '千',
    '百',
    '十',
    '万',
    '千',
    '百',
    '十',
    '',
  ].reverse(),
  upper: [
    '亿',
    '万',
    '仟',
    '佰',
    '拾',
    '亿',
    '万',
    '仟',
    '佰',
    '拾',
    '万',
    '仟',
    '佰',
    '拾',
    '',
  ].reverse(),
};

/**
 * 将正整数转为中文大写
 * max 万亿，过大返回 ''
 */
export function convertToChineseUpper(num: number) {
  return chineseNumber.small[Number(num)];
}

// js 随机生成 字符串+时间戳
export const randomString = () => {
  const timePart = `${dayjs().get('year')}${dayjs().get('M') + 1}${dayjs().get(
    'D',
  )}${dayjs().get('h')}${dayjs().get('minute')}${dayjs().get('s')}${dayjs().get(
    'millisecond',
  )}`;
  // 新增5位随机数（包含前导零的情况）
  const randomPart = Math.random().toString().slice(2, 7);

  return `${timePart}${randomPart}`;
};

/** 移除对象中的 空值 '' null undefined  */
export const shakingObj = <T = Record<string, any>, Result = Required<T>>(
  obj: T,
): Result => {
  const o = {} as Result;
  // @ts-ignore
  Object.keys(obj).forEach(key => {
    // @ts-ignore
    if (obj[key] || typeof obj[key] === 'boolean' || obj[key] === 0)
      // @ts-ignore
      o[key] = obj[key];
  });
  return o;
};

export const returnNoIconModalStyle = {
  className: 'modal_del',
  // centered: true,
  closable: true,
} as const;
export const returnDelModalStyle = {
  okType: 'primary',
  // okButtonProps: {
  //   style: { background: '#ED5555', color: '#fff' },
  // },
  closable: true,
  okText: I18N.base.confirm,
  cancelText: I18N.Factors.cancel,
} as const;

export const modalText = 'modal_text' as const;
export const listShowMobile = 'list_showMobile' as const;

/** 弹窗底部按钮样式 */
export const modelFooterBtnStyle = {
  ...returnDelModalStyle,
  ...returnNoIconModalStyle,
  // okButtonProps: {
  //   style: {
  //     background: '#0CBF9F',
  //     color: '#fff',
  //   },
  // },
};

// 开启定时任务
export const useInterval = (callback: () => void, delay?: number | null) => {
  const savedCallback = useRef(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [delay]);
};
//

/** 年份 默认1990-今年 */
export const getYear = (start?: number, end?: number) => {
  const startT = start ?? 1990;
  const endT = end ?? new Date().getFullYear();
  let result = [startT];
  while (result[result.length - 1] < endT) {
    result = result.concat(result[result.length - 1] + 1);
  }
  return result.reverse();
};

/**
 * 处理表格中没有render，并且没有数据的时候的展示
 * @param columns 当前的表头
 * @param text 传入为空的文案,默认是'-'
 * @returns 返回最新的表头
 */
export const changeTableColumnsNoText = <T>(
  columns: {
    children?: ColumnsType & { children?: ColumnsType[]; title: string }[];
    render?: () => JSX.Element;
  } & ColumnsType<T>,
  text: string,
  disableEllipsis = false,
) => {
  return columns.map(columnsItem => {
    if (columnsItem.title === I18N.Factors.operation) {
      columnsItem!.fixed = 'right';
    }
    if (!columnsItem.render) {
      columnsItem.render = (value: string | number) => {
        return noValueBackTextRender(value, text);
      };
    }
    if (!has(columnsItem, 'ellipsis')) {
      columnsItem!.ellipsis = true;
    }
    if (disableEllipsis) {
      columnsItem!.ellipsis = false;
    }

    return columnsItem;
  });
};

/**
 * 根据图片后缀获取对应的icon
 * @param suffix
 * @returns
 */
export const getSuffix = (suffix: string) => {
  if (['png', 'PNG', 'jpg', 'JPG', 'JPEG', 'jpeg'].includes(suffix)) {
    return 'icon-icon-tupian';
  }
  if (['pdf', 'PDF'].includes(suffix)) {
    return 'icon-a-icon-PDF';
  }
  if (['doc', 'DOC', 'docx', 'DOCX'].includes(suffix)) {
    return 'icon-icon-Word';
  }
  if (['xlsx', 'XLSX', 'XLS', 'xls'].includes(suffix)) {
    return 'icon-icon-Excel';
  }
  if (['rar', 'RAR'].includes(suffix)) {
    return 'icon-icon-rar';
  }
  if (['zip', 'ZIP'].includes(suffix)) {
    return 'icon-icon-ZIP';
  }
  return 'icon-icon-Word';
};

export const formatNumber = (num: number | null | undefined) => {
  if (!culHistory('edit')) {
    if (num === null || num === undefined) {
      return '-';
    }
    if (`${num}` === 'null' || `${num}` === 'undefined') {
      return '-';
    }
    // 判断是否为六位数以上
    if (Number(num) >= 100000) {
      return Number(num).toExponential(2);
    }

    // 判断小数点后是否超过四位
    const parts = num.toString().split('.');
    if (parts.length > 1 && parts[1].length > 4) {
      return Number(num).toExponential(2);
    }
    // 如果都不满足条件，则正常显示
    return num;
  }

  // 如果都不满足条件，则正常显示
  return num;
};
// processData 处理数据
export const processData = (
  data: { [x: string]: any },
  mapping: { [x: string]: any },
  langIdObj?: { [x: string]: any },
) => {
  // Extract keys that end with 'en'
  const keysEndingInEn = Object.keys(data).filter(key => key.endsWith('En'));

  // Map these keys to the desired output structure
  const languageSourceList = keysEndingInEn.map(key => {
    // Find the corresponding source type from the mapping using the key without 'En'
    const baseKey = key.replace('En', '');
    const sourceType = mapping[baseKey];

    return {
      langType: 2, // Assuming langType is always 2 as per your example
      sourceType: sourceType || null, // Fallback to null if no mapping is found
      sourceValue: data[key] || '', // Value from the data for the key ending with 'en'
      id: langIdObj?.[baseKey] || null, // 语言id
    };
  });

  return languageSourceList;
};
export function processItems(items: any[]): any {
  const gasTypeSeen = new Set(); // 用来存储已经见过的 gasType
  return items.map(item => {
    // 检查是否已经见过此 gasType
    if (gasTypeSeen.has(item.gasType)) {
      // 如果见过，设定 showAdd 为 false
      return { ...item, showAdd: false };
    }

    // 如果没见过，添加到 set 中并设定 showAdd 为 true
    gasTypeSeen.add(item.gasType);
    return { ...item, showAdd: true };
  });
}
export function getLangUagefn(
  languageSourceList: {
    sourceType_name: any;
    langType_name: any;
    sourceValue: any;
    id: any;
  }[],
  langUageObj: { [x: string]: any },
  langUageIdObj: { [x: string]: any },
) {
  languageSourceList?.forEach(
    (item: {
      sourceType_name: any;
      langType_name: any;
      sourceValue: any;
      id: any;
    }) => {
      langUageObj[`${item.sourceType_name}En`] = item.sourceValue;
      langUageIdObj[`${item.sourceType_name}`] = item.id;
    },
  );
  return {
    langUageObj,
    langUageIdObj,
  };
}
type MenuItem = Required<MenuProps>['items'][number];

export const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  style?: React.CSSProperties,
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
    style,
    className: 'custom_ant_menu_item',
  } as MenuItem;
};
//  定义方法 用于生成单据号 格式为 DJ+日期+后六位随机数
export function generateDocumentNumber() {
  // 获取当前日期并格式化为 YYYYMMDD 格式
  const date = new Date();
  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');

  // 获取当前时间戳的毫秒时间戳
  const timestampMs = new Date().getTime();
  // 将时间戳转换为字符串
  const timestampStr = timestampMs.toString();
  // 提取字符串的后六位
  const lastSixDigits = timestampStr.slice(-6);

  // 组合成单据号
  return `DJ${formattedDate}${lastSixDigits}`;
}
export const getInnermostChildren = (
  items: any[],
  result: any[] = [],
): any[] => {
  items?.forEach(item => {
    if (item.children) {
      getInnermostChildren(item.children, result);
    } else {
      result.push(omit(item, 'path'));
    }
  });
  return result;
};
// 添加默认值
export const mapMostChildrenSetDetaultValue = (data: any[]): any[] => {
  return data.map(item => {
    const newItem = { ...item, depth: item.depth || 0.25 };
    if (newItem.children) {
      newItem.children = mapMostChildrenSetDetaultValue(newItem.children);
    }
    return newItem;
  });
};
export const addPathToChildren = (data: any[], path = '') => {
  return data.map((item, index) => {
    const newPath = path ? `${path}-${index}` : `${index}`;
    const newItem = { ...item, path: newPath };
    if (newItem.children) {
      newItem.children = addPathToChildren(newItem.children, newPath);
    }
    return newItem;
  });
};
export const disableFirstChild = (data: any[]) => {
  return data.map((item, index) => {
    const newItem = { ...item, disabled: index === 0 };
    if (newItem.children) {
      newItem.children = disableFirstChild(newItem.children);
    }
    return newItem;
  });
};

export const convertScientificToString = (
  value: string | number | undefined,
) => {
  if (typeof value === 'number') {
    const fixedValue = value.toFixed(20).replace(/\.?0+$/, '');
    return fixedValue;
  }
  return value;
};
export function addCoordinates(nodes: any[]) {
  return nodes.map((node: any) => ({
    ...node, // 展开原有属性
    left: node.x, // 左坐标等于x
    top: node.y, // 顶坐标等于y
    right: node.x + node.width, // 右坐标等于x加上宽度
    bottom: node.y + node.height, // 底坐标等于y加上高度
  }));
}
// 函数判断点是否在节点内
export function isPointInNode(
  point: { x: number; y: number },
  node: { left: number; right: number; top: number; bottom: number },
) {
  return (
    (point.x >= node.left &&
      point.x <= node.right &&
      point.y >= node.top &&
      point.y <= node.bottom) ||
    (Number(point.x - node.right) > 0 && Number(point.x - node.right) < 5)
  );
}
// 函数找出点所在的节点
export function findNodeForPoint(
  point: { x: number; y: number },
  nodes: any[],
) {
  return nodes.find(node => isPointInNode(point, node));
}

// 定义函数计算点到节点顶部和底部的距离
export function calculateVerticalDistances(node: {
  top?: any;
  bottom?: any;
  point?: any;
}) {
  const { point } = node;
  const distanceToTop = Math.abs(point.y - node.top); // 点到顶部的距离
  const distanceToBottom = Math.abs(node.bottom - point.y); // 点到底部的距离
  return {
    distanceToTop,
    distanceToBottom,
  };
}
function generateRandomNumberInRange(min: number, max: number) {
  // 生成[min, max]范围内的随机数
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}
// 判断 distanceToTop 和 distanceToBottom 哪个小，据此决定新节点坐标
export function createNewNodeCoordinates(
  sourceNode: { distanceToTop?: any; distanceToBottom?: any; point?: any },
  targetNode: { point: { x: any; y: any } },
  baseMargin: number,
) {
  const { point } = sourceNode;
  const randomNumber = generateRandomNumberInRange(0, 20);
  const randomTopNumber = generateRandomNumberInRange(-15, 15);
  const randomXNumber = generateRandomNumberInRange(10, 20);
  let newCoordinates;
  if (sourceNode.distanceToTop < sourceNode.distanceToBottom) {
    // 向上创建新节点
    newCoordinates = [
      [sourceNode.point.x + baseMargin, sourceNode.point.y],
      [
        sourceNode.point.x + baseMargin,
        sourceNode.point.y -
          sourceNode.distanceToTop -
          baseMargin -
          40 -
          randomTopNumber,
      ],
      [
        targetNode.point.x - baseMargin,
        sourceNode.point.y -
          sourceNode.distanceToTop -
          baseMargin -
          40 -
          randomTopNumber,
      ],
      [targetNode.point.x - baseMargin, targetNode.point.y],
    ];
  } else if (sourceNode.point.x > targetNode.point.x) {
    // 向下创建新节点  向左链接
    //
    newCoordinates = [
      [point.x + baseMargin, point.y],
      [
        point.x + baseMargin,
        point.y + sourceNode.distanceToBottom + baseMargin + randomNumber,
      ],
      [
        targetNode.point.x - baseMargin - randomXNumber,
        point.y + sourceNode.distanceToBottom + baseMargin + randomNumber,
      ],
      [targetNode.point.x - baseMargin - randomXNumber, targetNode.point.y],
    ];
  } else {
    // 向下创建新节点  向右链接
    newCoordinates = [
      [point.x + baseMargin, point.y],
      [
        point.x + baseMargin,
        point.y + sourceNode.distanceToBottom + baseMargin + randomNumber,
      ],
      [
        targetNode.point.x - baseMargin,
        point.y + sourceNode.distanceToBottom + baseMargin + randomNumber,
      ],
      [targetNode.point.x - baseMargin, targetNode.point.y],
    ];
  }

  return newCoordinates;
}

export const returnComputationNameFn = (year: any, computationData: any[]) => {
  return computationData?.find((item: { year: any }) => item.year === year)
    ?.computationName;
};

/**
 * @description 详情用-去掉更新时间更新人创建人等字段
 * @param data 需要处理的对象
 * @returns 处理后的新对象
 */
export const omitInfoFn = (data: { [key: string]: any }) => {
  const newData = omit(data, [
    'updateByName',
    'updateTime',
    'updateBy',
    'createByName',
    'createTime',
    'createBy',
  ]);
  return newData;
};

const roundNum = (num: number, decimal: number) => {
  return Math.round(num * 10 ** decimal) / 10 ** decimal;
};

/** 返回数字输入框最大最小值限制后的值 */
export const returnInputNumberLimitFormatValue = ({
  value,
  min,
  max,
  precision,
}: {
  value?: string | number;
  min: number;
  max: number;
  precision: number;
}) => {
  if (!value) {
    return value;
  }

  const stringValue = String(value);
  const y = stringValue.indexOf('.') + 1;
  const count = stringValue.length - y;

  const inputValue = Number(value);

  if (isNaN(inputValue)) {
    return value;
  }

  let allocationCoefficientValue = 0;
  /** 如果输入的值为小数且小数位数超过了范围 输入数大于最大值 则取最大值 否则保留限制的小数位 */
  if (y > 0 && count > precision) {
    allocationCoefficientValue =
      inputValue > max ? max : roundNum(inputValue, precision);
  } else if (inputValue < min) {
    /** 如果输入值 小于 限制的最小值 则取最小值 */
    allocationCoefficientValue = min;
  } else if (inputValue > max) {
    /** 如果输入值 大于 限制的最大值， 则取最大值 */
    allocationCoefficientValue = max;
  } else {
    allocationCoefficientValue = inputValue;
  }

  return allocationCoefficientValue;
};

const approvalNodeLevel = () => ({
  1: I18N.dashborad.firstLevel,
  2: I18N.dashborad.secondLevel,
  3: I18N.dashborad.thirdLevel,
  4: I18N.dashborad.fourthLevel,
  5: I18N.dashborad.fifthLevel,
  6: I18N.dashborad.sixthLevel,
  7: I18N.dashborad.seventhLevel,
  8: I18N.dashborad.eighthLevel,
  9: I18N.dashborad.ninthLevel,
  10: I18N.dashborad.tenthLevel,
  11: I18N.dashborad.eleventhLevel,
  12: I18N.dashborad.twelfthLevel,
  13: I18N.dashborad.thirteenthLevel,
  14: I18N.dashborad.fourteenthLevel,
  15: I18N.dashborad.fifteenthLevel,
  16: I18N.dashborad.sixteenthLevel,
  17: I18N.dashborad.seventeenthLevel,
  18: I18N.dashborad.eighteenthLevel,
  19: I18N.dashborad.nineteenthLevel,
  20: I18N.dashborad.twentiethLevel,
});

/** 获取审批节点 */
export function getApprovalNodeLevel(num: number) {
  const levels = approvalNodeLevel();
  return levels?.[num as keyof typeof levels] || '';
}
