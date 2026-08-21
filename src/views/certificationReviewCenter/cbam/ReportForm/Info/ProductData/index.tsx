/**
 * @description 产品数据
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { getSearchParams } from '@/utils';

import OutsourcedPrecursor from './OutsourcedPrecursor';
import SelfWorkProcedure from './SelfWorkProcedure';
import style from './index.module.less';
import IndustrialProcessFlowDiagram from '../components/IndustrialProcessFlowDiagram';
import SupportFiles from '../components/SupportFiles';
import { OBJECT_TYPE } from '../components/SupportFiles/constant';

interface ProductDataProps {
  /** 下一步方法 */
  onClickNextStep: ({ reportId }: { reportId?: number }) => void;
  /** 返回方法 */
  onClickBack: () => void;
}

const ProductData = ({ onClickNextStep, onClickBack }: ProductDataProps) => {
  const { id: cbamId } = usePageInfo();
  const search = { ...getSearchParams()[0] };
  const authNo = search?.authNo;

  const isDetail = true;

  return (
    <div className={style.wrapper}>
      {/* 自厂工序产品数据 */}
      <SelfWorkProcedure authNo={authNo} cbamId={cbamId} isDetail={isDetail} />

      {/* 外购前体产品数据 */}
      <OutsourcedPrecursor
        authNo={authNo}
        cbamId={cbamId}
        isDetail={isDetail}
      />

      {/* 工业过程流程图 */}
      <IndustrialProcessFlowDiagram authNo={authNo} />

      {/* 产品数据证据材料 */}
      <SupportFiles
        authNo={authNo}
        showActionBtn={!isDetail}
        objectType={OBJECT_TYPE.PRODUCT_SUPPORT}
        cbamId={cbamId}
        key={`product${OBJECT_TYPE.PRODUCT_SUPPORT}${cbamId}`}
      />

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: I18N.carbonFootPrintLCA.nextStep,
            type: 'primary',
            onClick: async () => {
              onClickNextStep({ reportId: cbamId });
            },
          },
          {
            title: I18N.Factors.return,
            hidden: true,
            onClick: async () => {
              onClickBack();
            },
          },
        ])}
      />
    </div>
  );
};

export default ProductData;
