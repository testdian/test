/**
 *  computation模块枚举
 */
// hooks/useComputationEnum.ts
import { useState, useEffect } from 'react';

import { getComputationEnumsEnumName } from '@/sdks/computation/computationV2ApiDocs';
import { EnumOptionResp, getEnumOption } from '@/views/eca/hooks';

interface UseComputationEnumParams {
  enumType: string;
  defaultValue?: any[];
  // 可选参数，用于触发重新加载
  refreshKey?: any;
  // 添加 enabled 参数控制是否获取数据
  enabled?: boolean;
}

export const useComputationEnum = ({
  enumType,
  defaultValue = [],
  refreshKey = null,
  // 添加 enabled 参数控制是否获取数据
  enabled = true,
}: UseComputationEnumParams) => {
  const [enumData, setEnumData] = useState<EnumOptionResp[]>(defaultValue);
  useEffect(() => {
    // 当未启用时不执行请求
    if (!enabled) return;
    const fetchEnumData = async () => {
      const { data } = await getComputationEnumsEnumName({
        enumName: enumType,
      });
      const processedData = getEnumOption(data?.data || []);
      setEnumData(processedData);
    };

    // 当enumType或refreshKey变化时重新加载
    fetchEnumData();
  }, [enumType, enabled, refreshKey]);

  return enumData;
};
