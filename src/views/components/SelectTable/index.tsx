/*
 * @@description: 选择列表
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { Key, useEffect, useState } from 'react';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';

interface SelectTableRenderProps<RecordType extends object> {
  searchProps: SearchProps<RecordType>;
  /** api接口：获取列表数据 */
  searchApi: SearchProps<RecordType>['api'];
  /** 带过来的名称搜索值 */
  likeName?: string;
  /** 表头配置项 */
  columns: TableRenderProps<RecordType>['columns'];
  /** 确定按钮的事件 */
  onComfirm?: (id: Key) => void;
  /** 取消按钮的事件 */
  onCancel?: () => void;
}

export const SelectTable = <RecordType extends object = any>({
  searchProps,
  searchApi,
  likeName,
  columns,
  onComfirm,
  onCancel,
}: SelectTableRenderProps<RecordType>) => {
  const { tableRef } = useTable();
  const form = tableRef.current?.form;
  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 选中表格 */
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    form?.setValues({
      likeProductName: likeName,
    });
  }, []);

  return (
    <div>
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          ...searchProps,
          searchOnMount: false,
          api: searchApi,
        }}
        tableProps={{
          rowSelection: {
            type: 'radio',
            ...rowSelection,
          },
          rowKey: 'applyInfoId',
          columns,
          scroll: { x: 1400 },
        }}
        autoAddIndexColumn
        autoFixNoText
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: I18N.carbonFootPrintLCA.confirm,
            type: 'primary',
            disabled: selectedRowKeys.length === 0,
            onClick: async () => {
              onComfirm?.(selectedRowKeys[0]);
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              onCancel?.();
            },
          },
        ])}
      />
    </div>
  );
};
export default SelectTable;
