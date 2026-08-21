/*
 * @@description: 供应商管理/采购产品管理的导入
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-30 18:18:05
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:48:30
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useTimer } from '@/hooks';
import {
  ImportLog,
  getCarbonSystemImportLogPage,
} from '@/sdks_v2/new/systemV2ApiDocs';
import { FileType, SearchParamses } from '@/views/components/utils/types';

import Import from '../Import';
import TableList from '../Table';
import { columns } from './utils/columns';

function ImportFile({
  importType,
  importTypeName,
  importBtnLoading,
  importFlag,
  importFile,
}: {
  /** 导入类型 */
  importType: '1' | '2' | '3' | null | undefined;
  /** 导入类型名称 */
  importTypeName: string;
  /** 导入文件的loading */
  importBtnLoading: boolean;
  /** 导入标识 */
  importFlag: boolean;
  /** 模板文件 */
  // masterplateFile?: FileType;
  /** 导入 */
  importFile?: (record: FileType) => void;
}) {
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });
  // 开始定时器 和关闭定时器
  const { start, clear } = useTimer(() => tableDataFn(), 5000);

  /** 表格数据 */
  const [tableData, setTableData] = useState<ImportLog[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);
  const { approvalId } = useParams<{
    approvalId: string;
  }>();

  /** 表格loading */
  const [loading, changeLoading] = useState(false);
  const tableDataFn = async () => {
    if (importType) {
      changeLoading(true);
      getCarbonSystemImportLogPage({
        pageNum: searchParams.current,
        pageSize: searchParams.pageSize || 10,
        importType,
        dataId: Number(approvalId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setTableData(data?.data?.list);
          setTotal(data?.data?.total || 0);
          changeLoading(false);
        }
      });
    }
  };
  useEffect(() => {
    tableDataFn();
  }, [importType, importFlag, searchParams]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  return (
    <Import
      importBtnLoading={importBtnLoading}
      importFlag={importFlag}
      importTypeName={importTypeName}
      importFile={(record: FileType) => {
        clear();
        start();
        importFile?.(record);
      }}
    >
      <TableList
        loading={loading}
        columns={[...columns()]}
        dataSource={tableData}
        total={total}
        searchParams={searchParams}
        onchange={(current: number, pageSize: number) => {
          setSearchParams({
            current,
            pageSize,
          });
        }}
      />
    </Import>
  );
}
export default ImportFile;
