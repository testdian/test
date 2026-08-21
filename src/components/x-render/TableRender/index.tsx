/**
 * @@description: 基础表单组件
 * TODO：增加文档
 */
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import TableRender, {
  ProColumnsType,
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render';
import { SearchApi } from 'table-render/dist/src/types';

import { usePageNumberInfo } from '@/hooks';
import I18N from '@/lang/I18N';
import { changeTableColumnsNoText } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import style from './xrender.module.less';

interface CustomTableRenderProps<RecordType extends object, S extends object> {
  /** 传入的 tableRef */
  tableRef: any;
  /** 透传给  table-render Search 组件的参数*/
  searchProps: SearchProps<S>;
  /** 透传给  table-render Table 组件的参数*/
  tableProps: TableRenderProps<RecordType>;
  /** 是否自动将页面和表单搜索信息存储指 url SearchParams */
  autoSaveSearchInfo?: boolean;
  /** 是否自动增加序号 */
  autoAddIndexColumn?: boolean;
  /** 是否自动处理表单空值，默认占位符为 '-' */
  autoFixNoText?: boolean;
  /** 自定义表单空值的占位符 */
  customNoText?: string;
}
// 定义table的key常量
const ROW_KEY = 'id';
export const CustomTableRender = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RecordType extends object = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends object = any,
>({
  tableRef,
  searchProps,
  tableProps,
  autoSaveSearchInfo = false,
  autoAddIndexColumn = false,
  autoFixNoText = false,
  customNoText = '-',
}: CustomTableRenderProps<RecordType, S>) => {
  const { pageNum, pageSize, getParamsByKeys, setSearchParams } =
    usePageNumberInfo();
  const tableRefInfo: React.RefObject<TableContext> = tableRef;
  /** 表示表单是否准备完毕 */
  const [isFormReady, setIsFormReady] = useState(false);
  const active = useRef(false);

  /** 处理自增后的序号值 */
  const indexColumn = useIndexColumn<ProColumnsType<RecordType>>(
    (pageNum - 1) * pageSize,
  );

  /** 表格的columns */
  let tableColumns = tableProps?.columns || [];

  /** 如果传入autoAddIndexColumn，则处理序号自增 */
  if (autoAddIndexColumn) {
    tableColumns = [
      ...(indexColumn as ProColumnsType<RecordType>),
      ...tableColumns,
    ];
  }

  /** 如果传入autoFixNoText，则处理表格数据无值的情况 */
  if (autoFixNoText) {
    tableColumns = changeTableColumnsNoText(
      tableColumns,
      customNoText,
    ) as ProColumnsType<RecordType>;
  }

  /**
   * form onMount 回调存在多次调用的问题。
   * schema 更新变动后重新调用 onMount，参考：https://github.com/alibaba/x-render/blob/1.x/packages/form-render/src/form-render-core/src/index.js#L136
   * 业务组件有动态更新 schema 的情况。
   * 暂时使用 useEffect 解决。在 schema 有值后，只需调用一次 doSearch。
   */
  const isNeedDoSearch = useRef(true);

  useEffect(() => {
    if (tableRefInfo?.current?.form?.getSchema()) {
      setIsFormReady(true);
    }
  }, [!!tableRefInfo?.current?.form?.getSchema()]);
  /**
   * 使用`useEffect`来处理表单准备就绪且需要进行搜索的情况。
   * 当`isFormReady`为`true`，且`isNeedDoSearch`标记为`true`时，执行搜索操作。
   * 此函数会根据表单当前的值和自定义搜索参数来调用`doSearch`函数进行搜索，并将搜索参数设置回表单中。
   *
   * @依赖 {isFormReady} 表示表单是否准备完毕。
   */
  useEffect(() => {
    if (isFormReady && isNeedDoSearch.current) {
      // 获取表格上下文中的`doSearch`函数和表单实例
      const { doSearch, form } = tableRefInfo.current as TableContext;
      // 重置搜索标记
      isNeedDoSearch.current = false;

      // 提取表单的字段定义和键名
      const formData = (
        form?.getSchema() as {
          properties?: Record<string, any>;
        }
      )?.properties;
      const formKeys = formData ? Object.keys(formData) : [];

      // 根据表单键名提取自定义搜索参数，或使用URL查询参数中的`likeName`
      const customSearch = getParamsByKeys(formKeys);

      // 获取当前表单的值
      const currentFormValue = form.getValues();

      // 将当前表单值与自定义搜索参数合并为最终的搜索值
      const formValues = { ...currentFormValue, ...customSearch };

      // 执行搜索，并传入分页参数和合并后的搜索值
      doSearch?.({ current: pageNum, pageSize }, formValues);

      // 设置表单值为最终的搜索值，以保持表单状态与搜索参数的一致
      form.setValues(formValues);
    }
    // 仅当`isFormReady`变化时触发
  }, [isFormReady]);

  // 解决请求接口内存溢出
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  /**
   * 异步搜索API函数。
   * @param args 包含当前页码（current）和每页大小（pageSize）的对象。
   * @returns 返回搜索结果的Promise。
   *
   * 此函数首先调用传入的searchProps.api进行搜索，附加了当前页码和每页大小作为参数。
   * 如果autoSaveSearchInfo为真，则会保存搜索参数和表单值作为搜索参数。
   */
  const searchApi = async (args: { current: number; pageSize: number }) => {
    const result = await (searchProps?.api as SearchApi<RecordType>)?.({
      ...args,
      pageNum: args.current,
    });

    if (!active.current) {
      return {
        rows: [],
        data: [],
        total: 0,
      };
    }
    if (autoSaveSearchInfo) {
      const formValues = tableRefInfo?.current?.form.getValues();
      setSearchParams({
        pageNum: String(args.current),
        pageSize: String(args.pageSize),
        ...formValues,
      });
    }
    return result;
  };

  /**
   * 获取搜索请求函数。
   * @returns 返回一个包含搜索API函数或者API函数数组的数组。
   *
   * 根据searchProps.api的类型（数组或非数组），此函数将返回一个相应的格式化搜索请求对象数组。
   * 如果searchProps.api是数组，则每个项目都将与searchApi函数合并。
   */
  const getSearchRequest = () => {
    return Array.isArray(searchProps?.api)
      ? searchProps.api.map(item => ({ ...item, api: searchApi }))
      : searchApi;
  };

  /** 使用useMemo来避免不必要的计算和渲染-搜索区域属性 */
  const memoizedSearchProps = useMemo(
    () => ({
      ...searchProps,
      searchOnMount: !autoSaveSearchInfo && searchProps.searchOnMount,
      className: classNames(style.search, searchProps.className),
      searchText: I18N.utils.search,
      resetText: I18N.utils.reset,
    }),
    [searchProps],
  );

  /** 表格属性 */
  const memoizedTableProps = useMemo(
    () => ({
      ...tableProps,
      className: classNames(style.table, tableProps.className),
    }),
    [tableProps],
  );

  return (
    <TableRender
      ref={tableRefInfo}
      search={memoizedSearchProps}
      {...memoizedTableProps}
      request={getSearchRequest()}
      columns={tableColumns}
      rowKey={ROW_KEY}
      scroll={{
        x: 'max-content',
        ...tableProps.scroll,
      }}
      pagination={
        tableProps.pagination === false
          ? false
          : {
              locale: {
                items_per_page: I18N.utils.perPage,
              },
              showSizeChanger: true,
              size: 'small',
              ...tableProps.pagination,
            }
      }
    />
  );
};
