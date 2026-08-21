/**
 * @description 核查过程管理
 */
import { message } from 'antd';
import { useState } from 'react';

import { Page } from '@/components/Page';
import UploadFileDrawer from '@/components/UploadFileDrawer';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import {
  getVerificationProcessPageApi,
  uploadVerificationOpinionApi,
} from './service';
import {
  UploadFileItem,
  VerificationProcessItem,
  VerificationProcessPageReq,
} from './type';

const VerificationProcessPage = () => {
  const { refresh, tableRef } = useTable();

  const [uploadVisible, setUploadVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<VerificationProcessItem | null>(
    null,
  );
  const [currentFileList, setCurrentFileList] = useState<UploadFileItem[]>([]);

  const searchApi: CustomSearchProps<
    VerificationProcessItem,
    VerificationProcessPageReq
  > = async args => {
    const { data } = await getVerificationProcessPageApi(args);
    return {
      rows: data?.data?.list || [],
      total: data?.data?.total || 0,
    };
  };

  const handleUpload = (record: VerificationProcessItem) => {
    setCurrentRow(record);
    try {
      setCurrentFileList(JSON.parse(record.opinion || '[]') || []);
    } catch {
      setCurrentFileList([]);
    }
    setUploadVisible(true);
  };

  const handleClose = () => {
    setUploadVisible(false);
    setCurrentRow(null);
    setCurrentFileList([]);
  };

  return (
    <Page title='核查过程管理'>
      <CustomTableRender<VerificationProcessItem, VerificationProcessPageReq>
        tableRef={tableRef}
        searchProps={{
          schema: {},
          hidden: true,
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, onUpload: handleUpload }),
          scroll: { x: 'max-content' },
          rowKey: 'id',
          pagination: {
            showSizeChanger: true,
            size: 'small',
          },
        }}
        autoAddIndexColumn
        autoFixNoText
      />

      <UploadFileDrawer
        title='上传核查意见'
        tipText='支持PDF, JPG, JPEG, PNG, Word, Excel, zip, rar, msg格式文件，最大 50MB。'
        filesList={currentFileList}
        visible={uploadVisible}
        onClose={handleClose}
        onSave={async files => {
          if (!currentRow?.id) return;
          await uploadVerificationOpinionApi({
            id: currentRow.id,
            opinion: JSON.stringify(files),
          });
          message.success('上传成功');
          refresh?.();
          handleClose();
        }}
      />
    </Page>
  );
};

export default VerificationProcessPage;
