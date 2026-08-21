/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-29 19:32:53
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:47:41
 */
import { useEffect, useState } from 'react';

import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

export const UseGetUnitLabel = (unit?: string) => {
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');
  const [unitLabel, setUnitLabel] = useState<{
    unitLabel: string;
    unitValue: (number | string)[];
  }>();

  useEffect(() => {
    if (accountsUnitsList && unit) {
      const unitCode = unit?.split(',');
      let unitItem;
      /** 针对导入的采购产品获取单位翻译值 */
      if (unitCode && unitCode.length === 1) {
        unitItem = accountsUnitsList.factorUnitM.find(
          v => v.dictLabel === unit,
        );
      }
      /** 针对自建的采购产品获取单位翻译值 */
      if (unitCode && unitCode.length === 2) {
        unitItem = accountsUnitsList.factorUnitM.find(
          v => Number(v.dictValue) === Number(unitCode[1]),
        );
      }
      const unitLabelBack = unitItem ? unitItem.dictLabel : '';
      const unitValueBack = unitItem
        ? [unitItem.sourceType, unitItem.dictValue]
        : [];

      setUnitLabel({
        unitLabel: unitLabelBack,
        unitValue: unitValueBack,
      });
    }
  }, [accountsUnitsList, unit]);
  return unitLabel;
};
