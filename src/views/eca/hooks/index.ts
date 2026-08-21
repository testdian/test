/*
 * @@description: 企业碳核算 需要的Options
 */
import { useEffect, useState, useCallback } from 'react';

import { getAuthInfo } from '@/api/compution';
import {
  EnumResp,
  getComputationLibGwpList,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  getComputationComputationPage,
  getComputationEnumsEnumName,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  DictTypeResp,
  OrgPojo,
  Tree,
  getSystemDicttypePage,
  getSystemLibAddressTree,
} from '@/sdks/systemV2ApiDocs';
import {
  EmissionSource,
  getComputationDataSourceDetail,
  getComputationEmissionSourceId,
} from '@/sdks_v2/new/computationV2ApiDocs';

import {
  getEmissionSourceDetailApi,
  getEmissionSourceGroupDetailApi,
} from './service';
import { ComputationSourceGroupResp } from './type';
import { getAuditYearListApi } from '../accountingReport/service';

export interface EnumOptionResp {
  value?: number;
  label?: string;
  score?: number;
  children?: EnumOptionResp[];
}

export const getEnumOption = (
  arr: EnumResp[],
  newArr: EnumOptionResp[] = [],
) => {
  arr?.forEach(item => {
    newArr.push({
      label: item?.name || '',
      value: item?.code || 0,
      score: Number(item?.score) || 0,
      children: item?.subList ? getEnumOption(item?.subList) : undefined,
    });
  });
  return newArr;
};
/** 获取用户下的所有组织 */
export const UseOrgs = () => {
  const [orgs, setOrgs] = useState<OrgPojo[]>([]);
  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    setOrgs([]);
    // getSystemOrgUserList({
    //   likeOrgName: '',
    // }).then(({ data }) => {
    //   setOrgs(data?.data || []);
    // });
  }, []);
  return orgs;
};
/** *获取 碳排放核算**/
export const UseComputationPage = (data?: {
  year?: number;
  orgId?: number;
}) => {
  const [orgs, setOrgs] = useState<{ label?: string; value?: number }[]>([]);
  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    getComputationComputationPage({
      pageNum: 1,
      pageSize: 1000,
      year: data?.year,
      orgId: data?.orgId,
    }).then(({ data }) => {
      const newDataArr = data?.data?.list?.map(item => {
        return {
          label: item?.computationName,
          value: item?.id,
        };
      });
      if (newDataArr) {
        setOrgs([...(newDataArr || [])]);
      }
    });
  }, []);
  return orgs;
};
/**
 * 减排场景 单位枚举值
 * **/
export const ReturnEmissionReductionScenarioOPtion = () => {
  const [option, getOPtion] = useState<{ label: string; value: number }[]>([]);
  // 获取组织列表
  const apiGetOrgListFn = async () => {
    await getComputationEnumsEnumName({
      enumName: 'ReductionUnit',
    }).then(({ data }) => {
      if (data.code === 200) {
        const newArr = data?.data?.map(item => {
          return {
            label: item?.name || '',
            value: item?.code || 0,
          };
        });
        getOPtion([...(newArr || [])]);
      }
    });
  };
  useEffect(() => {
    apiGetOrgListFn();
  }, []);
  return option;
};
// 获取枚举值
export const ComputationEnums = (enumName: string) => {
  const [option, getOPtion] = useState<EnumOptionResp[]>([]);
  // 获取组织列表
  const apiGetOrgListFn = async () => {
    await getComputationEnumsEnumName({
      enumName,
    }).then(({ data }) => {
      if (data.code === 200) {
        const newArr = getEnumOption(data?.data || []);
        getOPtion([...newArr]);
      }
    });
  };
  useEffect(() => {
    apiGetOrgListFn();
  }, []);
  return option;
};
// 多层级枚举值
export const FistComputationEnums = (enumName: string) => {
  const [option, getOPtion] = useState<EnumResp[]>([]);
  // 获取组织列表
  const apiGetOrgListFn = async () => {
    await getComputationEnumsEnumName({
      enumName,
    }).then(({ data }) => {
      if (data.code === 200) {
        getOPtion([...(data.data || [])]);
      }
    });
  };
  useEffect(() => {
    apiGetOrgListFn();
  }, []);
  return option;
};
// 获取审核状态
export const apiGetOrgListFn = async (enumName: string) => {
  return getComputationEnumsEnumName({
    enumName,
  }).then(({ data }) => {
    if (data.code === 200) {
      const newArr = data?.data?.map(item => {
        return {
          label: item?.name || '',
          value: item?.code || 0,
          score: item?.score || 0,
        };
      });
      return newArr;
    }
    return [];
  });
};

// 获取地址树

export const AddressTree = () => {
  const [option, getOPtion] = useState<Tree[]>([]);
  const Fn = async () => {
    await getSystemLibAddressTree({ level: 3 }).then(({ data }) => {
      if (data.code === 200) {
        getOPtion([...(data.data || [])]);
      }
    });
  };
  useEffect(() => {
    Fn();
  }, []);
  return option;
};
// 获取GWP
export const useGwpOption = () => {
  const [option, setOption] = useState<{ [key: string | number]: number }>({});
  const getGwpOptionFn = async () => {
    await getComputationLibGwpList({ level: 3 }).then(({ data }) => {
      if (data.code === 200) {
        const newObj: { [key: string | number]: number } = {};
        data.data?.forEach(item => {
          newObj[item?.gas || 0] = item?.gwpValue || 0;
        });
        setOption({ ...newObj });
      }
    });
  };
  useEffect(() => {
    getGwpOptionFn();
  }, []);
  return option;
};

/**
 * 设置排放源详情
 * @param emissionSourceId 排放源ID
 * @returns
 */
export const useSetEmissionSourceInfo = (
  emissionSourceId?: number,
  computationDataSourceId?: string,
) => {
  const [info, setInfo] = useState<
    EmissionSource & {
      ghgCategory_name?: string;
      ghgClassify_name?: string;
      isoCategory_name?: string;
      isoClassify_name?: string;
      roleIds?: string;
      activityCategory_name?: string;
      calcMethod_name?: string;
      roleNames?: string;
    }
  >();
  // const computationDataSourceId = new URLSearchParams(
  //   window.location.search,
  // ).get('computationDataSourceId');

  useEffect(() => {
    if (computationDataSourceId) {
      getComputationEmissionSourceId({
        id: Number(emissionSourceId),
        computationDataSourceId: Number(computationDataSourceId),
      }).then(({ data }) => {
        setInfo(data?.data);
      });
      return;
    }
    if (emissionSourceId) {
      getComputationEmissionSourceId({
        id: emissionSourceId,
      }).then(({ data }) => {
        setInfo(data?.data);
      });
    }
  }, [emissionSourceId, computationDataSourceId]);
  return info;
};

/**
 * 获取排放源详情
 * @param emissionSourceId 排放源ID
 * @returns
 */
export const useEmissionSourceOrGroupInfo = (
  emissionSourceId?: number,
  isGroup?: boolean,
) => {
  const [info, setInfo] = useState<ComputationSourceGroupResp>();

  useEffect(() => {
    if (!emissionSourceId) {
      setInfo({});
      return;
    }

    if (isGroup) {
      getEmissionSourceGroupDetailApi({
        id: emissionSourceId,
      }).then(({ data }) => {
        setInfo(data?.data);
      });
    } else {
      getEmissionSourceDetailApi({
        id: emissionSourceId,
      }).then(({ data }) => {
        setInfo(data?.data);
      });
    }
  }, [emissionSourceId]);
  return info;
};

// 认证审核中心 排放源 详情
export const useSetAuthEmissionSourceInfo = (
  emissionSourceId?: number,
  authNo?: string,
) => {
  const [info, setInfo] = useState<EmissionSource>();
  // const computationDataSourceId = new URLSearchParams(
  //   window.location.search,
  // ).get('computationDataSourceId');

  useEffect(() => {
    if (!authNo) return;
    if (!emissionSourceId) return;
    getAuthInfo({
      emissionSourceId: Number(emissionSourceId),
      authNo: `${authNo}`,
    }).then(({ data }) => {
      setInfo(data?.data);
    });
  }, [emissionSourceId, authNo]);
  return info;
};
/**
 * 排放源详情带有活动数据
 * @param computationDataId 排放源数据Id
 * @param emissionSourceId 排放源id
 * @returns
 */
export const useSetEmissionDetailWithActivityData = (
  computationDataId?: number,
  emissionSourceId?: number,
) => {
  const [info, setInfo] = useState<EmissionSource>();
  useEffect(() => {
    if (computationDataId && emissionSourceId) {
      getComputationDataSourceDetail({
        computationDataId,
        emissionSourceId,
      }).then(({ data }) => {
        setInfo(data.data);
      });
    }
  }, [computationDataId, emissionSourceId]);
  return info;
};

/**
 * @description 获取数据字典的全部枚举值
 */

export const useAllDict = () => {
  const [dictList, setDictList] = useState<DictTypeResp[]>();
  useEffect(() => {
    getSystemDicttypePage({
      pageNum: 1,
      pageSize: 100000,
    }).then(({ data }) => {
      setDictList(data?.data?.list);
    });
  }, []);
  return dictList;
};

export const useDynamicDict = <T extends any[] = []>(
  fetchParams: {
    pageNum?: number;
    pageSize?: number;
    // 可扩展其他请求参数
  } = {},
  dependencies: T = [] as unknown as T,
) => {
  const [dictList, setDictList] = useState<DictTypeResp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const fetchDict = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        const { data } = await getSystemDicttypePage(
          {
            pageNum: 1,
            pageSize: 100000,
            ...fetchParams,
          },
          { signal },
        );
        setDictList(data?.data?.list || []);
      } catch (err) {
        if (!signal?.aborted) {
          setError(err as Error);
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [fetchParams],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchDict(controller.signal);
    return () => controller.abort();
  }, dependencies);

  return {
    data: dictList,
    loading,
    error,
    refresh: () => fetchDict(),
  };
};

/** 获取核算年度下拉框数据 */
export const useAccountYearList = () => {
  const [yearArr, setYearArr] = useState<{ year: number; id: number }[]>([]);
  useEffect(() => {
    getAuditYearListApi().then(({ data }) => {
      setYearArr(data?.data || []);
    });
  }, []);
  return yearArr;
};
