/*
 * @@description: 产品碳足迹-排放源详情（供应商碳数据、碳数据审核、采购产品-详情-产品碳足迹）
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-11 23:53:26
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 17:04:42
 */
import I18N from '@src/lang/I18N';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import {
  FootprintProcess,
  ProductionMaterialsDto,
  getSupplychainProcessFootprintSourceId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import EmissionFactor from '@/views/components/EmissionFactor';

type TypeProductionMaterialsDto = ProductionMaterialsDto | FootprintProcess;

function CarbonFootPrintEmissionSource() {
  const { factorPageInfo, factorInfo, factorId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    factorPageInfo: PageTypeInfo;
    factorId: string;
    factorInfo: string;
  }>();

  const { stageName, functionalUnit, beginDate, endTime } = JSON.parse(
    factorInfo || '{}',
  );

  /** 是否为新增页面 */
  const isAdd = factorPageInfo === PageTypeInfo.add;
  /** 是否为详情页面 */
  const isDetail = factorPageInfo === PageTypeInfo.show;

  /** 排放源详情 */
  const [emissionSourceFactorData, setEmissionSourceFactorData] =
    useState<TypeProductionMaterialsDto>();

  /** 排放源详情接口 */
  useEffect(() => {
    if (factorId) {
      getSupplychainProcessFootprintSourceId({
        id: Number(factorId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setEmissionSourceFactorData(data.data);
        }
      });
    }
  }, [factorId]);

  return (
    <EmissionFactor
      isAdd={isAdd}
      isDetail={isDetail}
      basicInfo={[
        {
          label: I18N.carbonFootPrintLCA.functionalUnits,
          value: functionalUnit,
        },
        {
          label: I18N.carbonFootPrint.accountingCycle,
          value:
            beginDate && endTime
              ? I18N.template(I18N.supplyChainCarbonManagement.begin2, {
                  val1: beginDate,
                  val2: endTime,
                })
              : '',
        },
        {
          label: I18N.carbonFootPrintLCA.lifeCycleStage,
          value: `${stageName}`,
        },
      ]}
      cathRecord={emissionSourceFactorData}
    />
  );
}
export default CarbonFootPrintEmissionSource;
