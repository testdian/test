/**
 * @description 供应商碳管理枚举
 */
import { useEffect, useState } from 'react';

import {
  EnumResp,
  getSupplychainEnumsEnumName,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

export const useSupplyChainEnums = (enumName: string) => {
  const [supplyChainenum, setSupplyChainenumEnum] = useState<EnumResp[]>();
  useEffect(() => {
    if (enumName) {
      getSupplychainEnumsEnumName({ enumName }).then(({ data }) => {
        if (data.code === 200) {
          setSupplyChainenumEnum(data.data);
        }
      });
    }
  }, [enumName]);
  return supplyChainenum;
};
