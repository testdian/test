/**
 * @description: 供应链碳管理-采购产品管理-详情-产品碳足迹-详情
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { getSupplychainApplyId } from '@/sdks_v2/new/supplychainV2ApiDocs';
import CarbonFootPrintInfo from '@/views/supplyChainCarbonManagement/components/CarbonFootPrintInfo';
import { ALL_CYCLE } from '@/views/supplyChainCarbonManagement/utils/constant';

import style from '../../../../SupplierManagement/Info/index.module.less';
import { PRODUCT_TABS } from '../../../Info/constant';

function Info() {
  const navigate = useNavigate();

  const { id, carbonFootPrintId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    carbonFootPrintPageTypeInfo: PageTypeInfo;
    carbonFootPrintId: string;
  }>();

  /** 获取数据请求类型 1: 核算结果 2: 核算过程 */
  const [applyType, setApplyType] = useState<number>();

  /** 是否是全生命周期 */
  const [isAllCycle, setIsAllCycle] = useState(false);

  /** 获取碳数据概览和数据要求的详情 */
  useEffect(() => {
    if (carbonFootPrintId) {
      getSupplychainApplyId({
        id: Number(carbonFootPrintId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setApplyType(Number(data?.data?.applyType));
          setIsAllCycle(Number(data?.data?.systemBoundaryType) === ALL_CYCLE);
        }
      });
    }
  }, [carbonFootPrintId]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <CarbonFootPrintInfo
        id={carbonFootPrintId}
        disabled
        applyType={applyType}
        isAllCycle={isAllCycle}
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.Factors.return,
            onClick: async () => {
              const base = virtualLinkTransform(
                SccmRouteMaps.sccmProdctInfo,
                [PAGE_TYPE_VAR, ':id'],
                [PageTypeInfo.show, id],
              );
              navigate(`${base}?tab=${PRODUCT_TABS.LCA}`);
            },
          },
        ])}
      />
    </div>
  );
}
export default Info;
