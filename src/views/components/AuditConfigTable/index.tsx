/**
 * @description 提交审批的审批流
 */
import { ProTable } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { keyBy } from 'lodash-es';
import { useMemo, useRef } from 'react';

import { columns } from './columns';
import { AuditNodeDto } from './type';

const AuditConfigTable = ({ dataSource }: { dataSource?: AuditNodeDto[] }) => {
  const tableRef = useRef<ActionType>();

  const columnsStateDefault = useMemo(() => {
    return keyBy(columns, 'dataIndex');
  }, []);

  return (
    <ProTable<AuditNodeDto>
      columns={columns()}
      actionRef={tableRef}
      pagination={false}
      search={false}
      columnsState={{
        persistenceKey: 'AuditConfigTable',
        persistenceType: 'localStorage',
        defaultValue: columnsStateDefault,
      }}
      toolBarRender={false}
      params={{
        tableData: dataSource,
      }}
      request={async params => {
        const { tableData } = params || {};
        return {
          data: tableData,
          success: true,
        };
      }}
    />
  );
};
export default AuditConfigTable;
