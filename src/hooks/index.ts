/**
 * @description: 全局共用hooks
 */
import html2canvas from 'html2canvas';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { getEnumsApi } from '@/api/compution';
import I18N from '@/lang/I18N';
import { PageTypeInfo } from '@/router/utils/enums';
import { getComputationEnumsEnumName } from '@/sdks/computation/computationV2ApiDocs';
import { EnumResp, getSystemEnumsEnumName } from '@/sdks/systemV2ApiDocs';
import { Toast, getSearchParams } from '@/utils';

/**
 * @description 获取枚举值
 * EnableStatus - 启用状态;
 * AuditType - 审批内容;
 * BizModule - 功能模块;
 * ConfigType - 配置类型;
 * FileStatus - 文件状态;
 * GasType - 温室气体类型;
 * ModuleType - 模块类型;
 * OperType - 操作类型;
 * OptionType - 多级结构复选框;
 * OrgType - 组织类型;
 * RoleType - 角色类型;
 * UserStatus - 用户状态;
 */
export const useAsyncEnums = (
  enumName:
    | 'EnableStatus'
    | 'AuditType'
    | 'BizModule'
    | 'ConfigType'
    | 'FileStatus'
    | 'GasType'
    | 'ModuleType'
    | 'OperType'
    | 'OptionType'
    | 'OrgType'
    | 'RoleType'
    | 'UserStatus'
    | 'DataStatus'
    | 'AuditStatus'
    | string,
) => {
  const [enums, setEnums] = useState<EnumResp[]>([]);
  useEffect(() => {
    getSystemEnumsEnumName({ enumName }).then(({ data }) =>
      setEnums(data?.data || []),
    );
  }, []);
  return enums;
};
//  获取字段翻译
//  获取语言字段
export const useLanguage = () => {
  const [language, setLanguage] = useState<{ [key: string]: number }>();
  useEffect(() => {
    getEnumsApi('SourceType').then(({ data }) => {
      const newObj: { [key: string]: number } = {};
      data?.data.forEach(item => {
        newObj[item.name] = item.code;
      });
      setLanguage(newObj);
    });
  }, []);
  return language;
};
export const AuthTypeOptionsArr = () => {
  const [language, setLanguage] = useState<any[]>();
  useEffect(() => {
    getEnumsApi('AuthType').then(({ data }) => {
      const newArr = data?.data.map(item => {
        return {
          label: item.name,
          value: item.code,
        };
      });
      setLanguage([...newArr]);
    });
  }, []);
  return language;
};
// 项目管理 审核状态
export const AuthAuditStatusOptionsArr = () => {
  const [language, setLanguage] = useState<any[]>();
  useEffect(() => {
    getComputationEnumsEnumName({ enumName: 'AuthAuditStatus' }).then(
      ({ data }) => {
        const newArr = data?.data?.map(item => {
          return {
            label: item.name,
            value: item.code,
          };
        });
        setLanguage([...(newArr || [])]);
      },
    );
  }, []);
  return language;
};
export const usePageNumberInfo = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNum = Number(searchParams.get('pageNum')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;

  const getParamsByKeys = useCallback(
    (keys?: (string | number | undefined | symbol)[]) => {
      if (!keys) return {};
      return keys.reduce((prev, cur) => {
        const searchParamsValueArr = searchParams.getAll(String(cur));
        if (cur && searchParamsValueArr && searchParamsValueArr.length === 1) {
          return {
            ...prev,
            [cur]: searchParams.get(String(cur)),
          };
        }
        if (cur && searchParamsValueArr && searchParamsValueArr.length > 1) {
          return {
            ...prev,
            [cur]: searchParamsValueArr,
          };
        }
        return prev;
      }, {});
    },
    [],
  );
  return {
    pageNum,
    pageSize,
    getParamsByKeys,
    setSearchParams,
  };
};

type PageInfoType = {
  isAdd: boolean;
  isEdit: boolean;
  isDetail: boolean;
  id: number;
  [property: string]: any;
};

/** echarts图片下载方法 */
export const useDownloadHandler = (fileName: () => string, id: string) => {
  const handleDownload = useRef(
    debounce(() => {
      const element = document.getElementById(id);
      if (element) {
        html2canvas(element, { scale: 2 })
          .then(canvas => {
            // 将Canvas转换为图像URL
            const imageURL = canvas.toDataURL('image/png');
            // 创建一个隐藏的<a>标签，并设置下载属性
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = `${fileName?.()}.png`;
            // 模拟点击链接以触发下载
            link.click();
          })
          .catch(() => {
            Toast('error', I18N.carbonData.downloadFailed);
          });
      }
    }, 500),
  ).current;

  return handleDownload;
};

/**
 * @description 获取页面信息
 */
export const usePageInfo = (): PageInfoType => {
  const { pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
  }>();
  const search = { ...getSearchParams()[0] };
  return {
    ...search,
    isAdd: pageTypeInfo === PageTypeInfo.add,
    isEdit: pageTypeInfo === PageTypeInfo.edit,
    isDetail: pageTypeInfo === PageTypeInfo.show,
    id: Number(search?.id),
  };
};

/**
 * @description 控制表格纵向滚动的高度
 * @param otherHeigh 表格距离底部的高度
 * @param domId 多个表格时，表格id
 * @returns scrollY 表格纵向滚动区域的高度
 */
export const useTableScrollHeight = (otherHeigh?: number, domId?: string) => {
  /* 全局表单提交框高度 */
  const globalFormActionsHeight = 60;

  /** 表格纵向滚动区域的高度 */
  const [scrollY, setScrollY] = useState('');

  /**
   * 获取第一个表格的可视化高度
   * @param {*} extraHeight 额外的高度(表格底部内容的高度 Number类型 包含返回返回按钮的高度60、底部边距 28)
   * @param {*} id 当前页面中有多个table时需要制定table的id
   */
  const getTableScroll = (
    extraHeight: number = globalFormActionsHeight + 28,
    id?: string,
  ) => {
    let tHeader = null;
    if (id) {
      tHeader = document.getElementById(id)
        ? document
            ?.getElementById(id)
            ?.getElementsByClassName('ant-table-thead')[0]
        : null;
    } else {
      tHeader = document?.getElementsByClassName('ant-table-thead')[0];
    }
    // 表格内容距离顶部的距离
    let tHeaderBottom = 0;
    if (tHeader) {
      tHeaderBottom = tHeader.getBoundingClientRect().bottom;
    }

    // 窗体高度-表格内容顶部的高度-表格内容底部的高度
    // let height = document.body.clientHeight - tHeaderBottom - extraHeight
    const height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`;
    return height;
  };

  useEffect(() => {
    setScrollY(getTableScroll(otherHeigh, domId));
  }, []);

  return scrollY;
};

export function useTimer(callback: () => void, interval: number | null) {
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   // Function to clear the timer
  //   function clearTimer() {
  //     if (timerId.current) {
  //       clearInterval(timerId.current);
  //       timerId.current = null;
  //     }
  //   }

  //   // Set up the timer only if interval is not null
  //   if (interval !== null) {
  //     timerId.current = setInterval(callback, interval);
  //   }

  //   // Clean-up function to clear the timer when component unmounts or interval changes
  //   return clearTimer;
  // }, [interval, callback]); // Reacts only if interval or callback changes

  return {
    start: () => {
      // Start only if timer is not already running
      if (!timerId.current && interval !== null) {
        timerId.current = setInterval(callback, interval);
      }
    },
    clear: () => {
      // Clear the timer
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    },
  };
}
