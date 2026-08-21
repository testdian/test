// import type { ActionType } from '@ant-design/pro-components';
// import { ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button, Descriptions, Space } from 'antd';
// import { keyBy } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// import { PageTypeInfo } from '@/router/utils/enums';
import {
  getExportDataSourceTreeApi,
  postDeleteEmissionSourceApi,
} from '@/api/compution';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ComputationData,
  getComputationDataId,
  // getComputationDataSourceList,
} from '@/sdks_v2/new/computationV2ApiDocs';

// import { columns } from './columns';
import {
  changeSubmitFalseAction,
  changeSubmitTrueAction,
} from '@/store/action/fillDataSource';
import { modal } from '@/store/module/notification';
import { RootState } from '@/store/types';
import { Toast } from '@/utils';
import { culHistory } from '@/views/supplyChainCarbonManagement/utils';

import EmissionSourceList, {
  ChildComponentRef,
} from '../../carbonMissionAccounting/component/EmissionSourceList';

const EmissionData = ({
  id,
  computionId,
  setDataStatus,
}: {
  id: number;
  computionId?: number;
  setDataStatus?: (status: number) => void;
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const childRef = useRef<ChildComponentRef>(null);
  /** 排放填报详情 */
  const [fillDataDetail, getFillDataDetail] = useState<ComputationData>({});
  const { orgName, year, dateRange } = fillDataDetail || {};
  const navigate = useNavigate();
  const { pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
  }>();
  /** 获取排放填报详情 */
  useEffect(() => {
    if (id) {
      getComputationDataId({ id }).then(({ data }) => {
        getFillDataDetail({ ...data.data });
        setDataStatus?.(Number(data?.data?.dataStatus));
      });
    }
  }, [id]);
  const handleFetchData = () => {
    if (childRef.current) {
      childRef.current.getSourceTreeApiFn();
    }
  };
  const selector = useSelector((s: RootState) => s);
  // const [outCurrentKey, setOutCurrentKey] = useState<string>('');

  return (
    <div>
      {pageTypeInfo !== PageTypeInfo.show && !culHistory('approvalManage') && (
        <Space
          align='end'
          style={{
            marginBottom: 16,
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {checkAuth(
            '/fillDataInfo/chooseEmissionSource',
            <Button
              type='primary'
              onClick={() => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.fillDataAccountingSource,
                    [PAGE_TYPE_VAR, ':id', ':approvalId'],
                    [pageTypeInfo, computionId, id],
                  ),
                );
              }}
            >
              {I18N.eca.selectingEmissionSources}
            </Button>,
          )}
          {checkAuth(
            '/fillDataInfo/AllDel',
            <Button
              onClick={() => {
                if (selectedRowKeys.length === 0) {
                  Toast('error', I18N.eca.pleaseSelectData2);
                  return;
                }
                modal.confirm({
                  content: (
                    <span>
                      {I18N.eca.confirmDeletion}
                      {I18N.eca.operateirreversible}
                    </span>
                  ),
                  onOk: async () => {
                    const selectedRowKeys = selectedRow.map(
                      item => item.emissionSourceId,
                    );
                    await postDeleteEmissionSourceApi({
                      emissionSourceIds: selectedRowKeys.join(','),
                      id: `${computionId}`,
                      delType: 2,
                    });
                    Toast('success', I18N.Factors.deleteSuccessful);
                    if (selector.fillDataSource.isSubmit) {
                      changeSubmitFalseAction();
                    } else {
                      changeSubmitTrueAction();
                    }
                    setSelectedRowKeys([]);
                    handleFetchData();
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              }}
            >
              {I18N.eca.batchDeletion}
            </Button>,
          )}
          {/**
           * TODO - 按钮隐藏
           * ***/}
          {/* {false && ( */}
          {checkAuth(
            '/fillDataInfo/import',
            <Button
              type='primary'
              onClick={() => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.fillDataInfoImport,
                    [PAGE_TYPE_VAR, ':id', ':approvalId'],
                    [pageTypeInfo, computionId, id],
                  ),
                );
              }}
            >
              {I18N.carbonFootPrint.import}
            </Button>,
          )}
          {/* )} */}
          {checkAuth(
            '/fillDataInfo/export',
            <Button
              type='primary'
              onClick={async () => {
                await getExportDataSourceTreeApi({
                  computationDataId: `${id}`,
                });
                modal.confirm({
                  title: I18N.eca.exportFilledInQuantity2,
                  content: I18N.eca.exportFilledInQuantity,
                  onOk: async () => {
                    navigate(RouteMaps.systemDownload);
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              }}
            >
              {I18N.eca.export}
            </Button>,
          )}
        </Space>
      )}

      <Descriptions bordered style={{ marginBottom: 16 }}>
        {/* TODO - 后端缺少两个字段 */}
        <Descriptions.Item label={I18N.eca.accountingName}>
          {fillDataDetail.computationName || ''}
        </Descriptions.Item>
        <Descriptions.Item label={I18N.carbonData.affiliatedOrganization}>
          {orgName || ''}
        </Descriptions.Item>
        <Descriptions.Item label={I18N.carbonData.accountingYear}>
          {year || ''}
        </Descriptions.Item>
        <Descriptions.Item label={I18N.eca.dataCollection}>
          {dateRange || ''}
        </Descriptions.Item>
        <Descriptions.Item label={I18N.supplyChainCarbonManagement.gwpVersion}>
          {fillDataDetail.gwpVersion_name || ''}
        </Descriptions.Item>
      </Descriptions>

      <EmissionSourceList
        isFillData
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        setSelectedRow={setSelectedRow}
        isShow={pageTypeInfo !== PageTypeInfo.show}
        fillDataDetail={fillDataDetail}
        ref={childRef}
        // setOutCurrentKey={setOutCurrentKey}
      />
    </div>
  );
};
export default EmissionData;
