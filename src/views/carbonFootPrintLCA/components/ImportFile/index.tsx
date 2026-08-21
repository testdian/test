/*
 * @@description: 导入清单
 */
import { useEffect, useState } from 'react';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { getSystemImportLogPage } from '@/sdks_v2/new/systemV2ApiDocs';
import { FileType } from '@/views/components/utils/types';

import Import from '../Import';
import { columns } from './utils/columns';
import { SupplierListRequest, SupplierResp } from './utils/type';

function ImportFile({
  importType,
  importTypeName,
  masterplateFile,
  importBtnLoading,
  importFlag,
  importFile,
  dataId,
}: {
  /** 导入类型 */
  importType: '1' | '2' | '4';
  /** 导入类型名称 */
  importTypeName: string;
  /** 导入文件的loading */
  importBtnLoading: boolean;
  /** 导入标识 */
  importFlag: boolean;
  /** 模板文件 */
  masterplateFile: FileType;
  /** 导入 */
  importFile?: (record: FileType) => void;
  /** 关联数据id */
  dataId?: number;
}) {
  const { refresh, tableRef } = useTable();

  const [allSuccess, setAllSuccess] = useState<boolean>(false);

  const searchApi: CustomSearchProps<
    SupplierResp,
    SupplierListRequest
  > = args =>
    getSystemImportLogPage({ ...args, importType, dataId }).then(({ data }) => {
      const success = !data?.data?.list?.some(
        item => `${item.importStatus}` === '0',
      );
      setAllSuccess(success);
      return data?.data;
    });

  useEffect(() => {
    refresh?.();
  }, [importFlag]);

  /** 定时器 */
  let timer: string | number | NodeJS.Timeout | undefined;
  useEffect(() => {
    timer = setInterval(() => {
      refresh?.({
        stay: true,
        tab: 1,
      });
      // 导入清单接口后端没有异步，需要一直请求
      // if (allSuccess) {
      //   clearInterval(timer);
      // }
    }, 5000);

    return () => clearInterval(timer);
  }, [allSuccess]);

  return (
    <Import
      importType={importType}
      importBtnLoading={importBtnLoading}
      importFlag={importFlag}
      importTypeName={importTypeName}
      masterplateFile={masterplateFile}
      importFile={(record: FileType) => {
        importFile?.(record);
      }}
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          hidden: true,
          schema: { type: 'void', properties: {} },
          searchOnMount: false,
          api: searchApi,
        }}
        tableProps={{
          columns: columns(),
        }}
        autoFixNoText
      />
    </Import>
  );
}
export default ImportFile;
