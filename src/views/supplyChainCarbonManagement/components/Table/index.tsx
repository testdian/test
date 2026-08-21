/*
 * @@description: 表格
 */

import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { ReactNode, Ref, memo } from 'react';

import { changeTableColumnsNoText } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/components/utils/types';

export interface CommonProps<T> extends TableProps<T> {
  /** 表头 */
  columns: ColumnsType<T>;
  /** 页码配置参数 */
  searchParams?: SearchParamses;
  /** 数据总数 */
  total?: number;
  /** 切换页码的方法 */
  onchange?: (current: number, pageSize: number) => void;
}
const TableList = memo(
  <
    RecordType extends JSX.IntrinsicAttributes &
      TableProps<object> & { children?: ReactNode } & {
        ref?: Ref<HTMLDivElement> | undefined;
      },
  >(
    props: CommonProps<RecordType> & TableProps<RecordType>,
  ) => {
    const { columns, searchParams, total, onchange, ...otherParams } = props;

    /** 序号列 */
    const indexColumn = useIndexColumn<any>(0);

    /** 表头 */
    const column = [...indexColumn, ...columns];

    return (
      <Table
        {...otherParams}
        columns={changeTableColumnsNoText(column, '-')}
        pagination={
          searchParams
            ? {
                pageSize: searchParams?.pageSize
                  ? +searchParams.pageSize
                  : undefined,
                current: searchParams?.current
                  ? +searchParams.current
                  : undefined,
                total,
                size: 'small',
                onChange: (current: number, pageSize: number) => {
                  onchange?.(current, pageSize);
                },
              }
            : false
        }
      />
    );
  },
);
export default TableList as <RecordType>(
  props: CommonProps<RecordType> & TableProps<RecordType>,
) => JSX.Element;
