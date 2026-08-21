import { useRef } from 'react';
import { TableContext } from 'table-render';
import { TableRenderStoreType } from 'table-render/dist/src/core/store';

import { UseTableRefResult } from './type';
/**
 * useTableRef 钩子函数提供了一个对表格组件的引用以及相关操作方法。
 * 该函数不接受任何参数。
 *
 * @returns {UseTableRefResult} 返回一个对象，包含:
 *  - tableRef: 一个用于指向 TableContext 的 useRef 变量，初始值为 null。
 *  - refresh: 一个用于刷新表格的异步方法。
 *  - doSearch: 一个用于执行表格搜索的方法，类型为 TableContext['doSearch']。
 */
export const useTableRef = (): UseTableRefResult => {
  const tableRef = useRef<TableContext | null>(null);
  return {
    tableRef,
    refresh: ((...args: any) =>
      tableRef.current?.refresh?.(...args)) as TableContext['refresh'],
    doSearch: ((...args: any) =>
      (tableRef.current?.doSearch as any)?.(
        ...args,
      )) as TableContext['doSearch'],
    setState: ((...args: any) =>
      (tableRef.current?.getState()?.setState as any)?.(
        ...args,
      )) as TableRenderStoreType['setState'],
  };
};
