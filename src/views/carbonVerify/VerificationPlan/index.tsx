/**
 * @description 核查计划管理
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { Toast } from '@/utils';

import { columns } from './columns';
import { AddVerificationPlanModal } from './components/AddVerificationPlanModal';
import { addVerificationPlanApi, getVerificationPlanPageApi } from './service';
import {
  AddVerificationPlanReq,
  VerificationPlanItem,
  VerificationPlanPageReq,
} from './type';

const VerificationPlanPage = () => {
  const { refresh, tableRef } = useTable();

  const navigate = useNavigate();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalLoading, setAddModalLoading] = useState(false);

  const searchApi: CustomSearchProps<
    VerificationPlanItem,
    VerificationPlanPageReq
  > = args =>
    getVerificationPlanPageApi(args).then(({ data }) => {
      return data?.data;
    });

  const handleAddOk = async (
    values: Omit<AddVerificationPlanReq, 'orgCodes'> & { orgCodes: string[] },
  ) => {
    try {
      setAddModalLoading(true);
      await addVerificationPlanApi({
        ...values,
        orgCodes: values.orgCodes.join(','),
      });
      Toast('success', '新增成功');
      setAddModalOpen(false);
      refresh?.();
    } finally {
      setAddModalLoading(false);
    }
  };

  return (
    <Page
      title='核查计划管理'
      actionBtnChild='新增'
      onBtnClick={async () => setAddModalOpen(true)}
    >
      <CustomTableRender<VerificationPlanItem, VerificationPlanPageReq>
        tableRef={tableRef}
        searchProps={{
          schema: {},
          hidden: true,
          api: searchApi,
        }}
        tableProps={{
          columns: columns({
            refresh,
            navigate,
          }),
          scroll: { x: 1000 },
          rowKey: 'id',
          pagination: {
            showSizeChanger: true,
            size: 'small',
          },
        }}
        autoAddIndexColumn
        autoFixNoText
      />
      <AddVerificationPlanModal
        open={addModalOpen}
        confirmLoading={addModalLoading}
        onCancel={() => setAddModalOpen(false)}
        onOk={handleAddOk}
      />
    </Page>
  );
};

export default VerificationPlanPage;
