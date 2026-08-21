/*
 * @@description: 企业碳核算-核算过程
 */
import I18N from '@src/lang/I18N';
import { ColumnsType } from 'antd/lib/table';
import { compact } from 'lodash-es';

import CommonHeader from '@/components/CommonHeader';
import { TableActions } from '@/components/Table/TableActions';
import { ComputationProcess } from '@/sdks_v2/new/supplychainV2ApiDocs';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';
import { CarbonDataPropsType } from '../../utils/type';

function CarbonAccountingProcess({
  /** 顶部展示的信息 */
  basicInfo,
  /** 过程数据 */
  computationProcess,
  /** 列表加载loading */
  loading,
  /** 总页数 */
  total,
  /** 页码配置 */
  searchParams,
  /** 切换分页的按钮 */
  onchange,
  /** 列表查看按钮事件 */
  onDetailClick,
}: CarbonDataPropsType) {
  /** 表格操作栏 */
  const actionColumns: ColumnsType<ComputationProcess> = [
    {
      title: I18N.Factors.operation,
      dataIndex: 'action',
      width: 100,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  onDetailClick?.(row);
                },
              },
            ])}
          />
        );
      },
    },
  ];

  /** 表格表头 */
  const column = [...columns(), ...actionColumns];
  return (
    <main>
      <CommonHeader basicInfo={basicInfo} />
      <TableList
        columns={column}
        dataSource={computationProcess}
        loading={loading}
        total={total}
        searchParams={searchParams}
        onchange={onchange}
      />
    </main>
  );
}
export default CarbonAccountingProcess;
