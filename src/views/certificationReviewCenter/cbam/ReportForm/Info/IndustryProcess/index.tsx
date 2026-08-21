/**
 * @description 工业过程
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { getSearchParams } from '@/utils';

import OutsourcedPrecursor from './OutsourcedPrecursor';
import ProcessDirectEmission from './ProcessDirectEmission';
import SelfWorkProcedure from './SelfWorkProcedure';
import style from './index.module.less';
import { getProductProcessListApi } from '../../service';
import { ProductProcessResp } from '../../type';
import IndustrialProcessFlowDiagram from '../components/IndustrialProcessFlowDiagram';
import SupportFiles from '../components/SupportFiles';
import { OBJECT_TYPE } from '../components/SupportFiles/constant';

interface IndustryProcessProps {
  /** 下一步方法 */
  onClickNextStep: ({ reportId }: { reportId?: number }) => void;
  /** 返回方法 */
  onClickBack: () => void;
}

const IndustryProcess = ({
  onClickNextStep,
  onClickBack,
}: IndustryProcessProps) => {
  const { id: cbamId } = usePageInfo();

  const isDetail = true;

  const search = { ...getSearchParams()[0] };
  const authNo = search?.authNo;

  /** 工序过程流程图ref */
  const FlowDiagramRef = useRef<{
    onRefreshFlowDiagram: () => void;
  }>();

  /** 刷新流程图方法 */
  const onRefreshFlowDiagram = () => {
    FlowDiagramRef.current?.onRefreshFlowDiagram();
  };

  /** 工序信息数据 自厂工序信息表/过程直接排放 */
  const [dataSourceProcess, setDataSourceProcess] = useState<
    ProductProcessResp[]
  >([]);

  /** 工序信息loading */
  const [loadingProcess, setLoadingProcess] = useState(false);

  /** dataSourceProcess刷新标识 */
  const [refreshProcess, setRefreshProcess] = useState(false);

  /** 刷新dataSourceProcess方法 */
  const onRefreshProcess = () => {
    setRefreshProcess(!refreshProcess);
    /** 刷新流程图 */
    onRefreshFlowDiagram();
  };

  /** 更改工序信息数据 */
  const onChangeDataSourceProcess = (data: ProductProcessResp[]) => {
    setDataSourceProcess(data);
  };

  /** 获取工序信息 */
  const getDataSourceProcess = async () => {
    setLoadingProcess(true);
    try {
      const { data } = await getProductProcessListApi({
        authNo,
      });
      setDataSourceProcess(data?.data || []);
      setLoadingProcess(false);
    } catch (error) {
      setDataSourceProcess([]);
      setLoadingProcess(false);
    }
  };

  useEffect(() => {
    /** 获取工序信息 */
    if (authNo) {
      getDataSourceProcess();
    }
  }, [authNo, refreshProcess]);

  return (
    <div className={style.wrapper}>
      {/* 自厂工序信息表 */}
      <SelfWorkProcedure
        cbamId={cbamId}
        isDetail={isDetail}
        dataSource={dataSourceProcess}
        onChangeDataSource={onChangeDataSourceProcess}
        loading={loadingProcess}
        onRefresh={onRefreshProcess}
      />

      {/* 外购前体信息表 */}
      <OutsourcedPrecursor
        cbamId={cbamId}
        authNo={authNo}
        isDetail={isDetail}
        onRefreshFlowDiagram={onRefreshFlowDiagram}
      />

      {/* 工业过程流程图 */}
      <IndustrialProcessFlowDiagram authNo={authNo} ref={FlowDiagramRef} />

      {/* 过程直接排放 */}
      <ProcessDirectEmission
        cbamId={cbamId}
        authNo={authNo}
        isDetail={isDetail}
        dataSource={dataSourceProcess}
        onRefresh={onRefreshProcess}
        loading={loadingProcess}
      />

      {/* 工业过程证据材料 */}
      <SupportFiles
        authNo={authNo}
        showActionBtn={!isDetail}
        objectType={OBJECT_TYPE.PROCESS_SUPPORT}
        cbamId={cbamId}
        key={`process${OBJECT_TYPE.PROCESS_SUPPORT}${cbamId}`}
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

export default IndustryProcess;
