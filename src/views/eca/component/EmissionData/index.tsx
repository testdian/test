import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Descriptions } from 'antd';
import { keyBy } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import {
  ComputationData,
  getComputationDataId,
  getComputationDataSourceList,
} from '@/sdks_v2/new/computationV2ApiDocs';

import { EmissionSourceType, columns } from './columns';

const EmissionData = ({
  id,
  dataId,
  auditStatus,
  isDetail,
  pageTypeInfo,
}: {
  id: number;
  dataId?: number;
  auditStatus?: string;
  isDetail: boolean;
  pageTypeInfo?: PageTypeInfo;
}) => {
  const navigate = useNavigate();

  const tableRef = useRef<ActionType>();

  const columnsStateDefault = useMemo(() => {
    return keyBy(columns, 'dataIndex');
  }, []);

  /** 排放填报详情 */
  const [fillDataDetail, getFillDataDetail] = useState<ComputationData>({});
  const { orgName, year, dateRange } = fillDataDetail || {};

  /** 获取排放填报详情 */
  useEffect(() => {
    if (id) {
      getComputationDataId({ id }).then(({ data }) => {
        getFillDataDetail({ ...data.data });
      });
    }
  }, [id]);

  return (
    <div>
      <Descriptions bordered style={{ marginBottom: 16 }}>
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
          {dateRange || ''}
        </Descriptions.Item>
      </Descriptions>
      <ProTable<EmissionSourceType>
        columns={columns({
          id,
          dataId,
          auditStatus,
          isDetail,
          pageTypeInfo,
          navigate,
        })}
        actionRef={tableRef}
        pagination={{
          pageSize: 10,
          showTotal: undefined,
        }}
        scroll={{ x: 1400 }}
        search={false}
        columnsState={{
          persistenceKey: 'ProcessModalTable',
          persistenceType: 'localStorage',
          defaultValue: columnsStateDefault,
        }}
        toolBarRender={false}
        params={{
          computationDataId: id,
        }}
        request={async params => {
          const {
            computationDataId,
            current = 1,
            pageSize = 10,
          } = params || {};
          return getComputationDataSourceList({
            computationDataId,
            pageNum: current,
            pageSize,
          }).then(({ data }) => {
            return data?.data;
          });
        }}
      />
    </div>
  );
};
export default EmissionData;
