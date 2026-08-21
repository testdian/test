/**
 * @description 选择CBAM报表弹窗
 */
import { Button, Modal } from 'antd';
import { FC, useState } from 'react';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import I18N from '@/lang/I18N';
import { getCbamList } from '@/views/cbam/ReportForm/service';
import { CbamRequest, GeneralInfoProps } from '@/views/cbam/ReportForm/type';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './searchSchema';

type ChooseCbamModelProps = {
  /** 弹窗显隐 */
  open: boolean;
  /** 确定按钮loading */
  confirmLoading: boolean;
  /** 点击取消按钮的方法 */
  handleCancel: () => void;
  /** 点击确定按钮的方法 */
  handleOk: (data?: {
    selectRows?: GeneralInfoProps[];
    selectedRowKeys?: React.Key[];
  }) => void;
};

const ChooseCbamModel: FC<ChooseCbamModelProps> = ({
  open,
  confirmLoading,
  handleCancel,
  handleOk,
}) => {
  const { tableRef } = useTableRef();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 设置选择的数据 */
  const [selectRows, setSelectRows] = useState<GeneralInfoProps[]>([]);

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 是否禁用 */
  const disabled = selectedRowKeys.length === 0;

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: GeneralInfoProps[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const searchApi: CustomSearchProps<GeneralInfoProps, CbamRequest> = args =>
    getCbamList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Modal
      title={I18N.certificationReviewCenter.chooseCbam}
      open={open}
      width='70%'
      centered
      maskClosable={false}
      destroyOnClose
      onCancel={() => {
        /** 关闭弹窗取消弹窗表格选中 */
        setSelectedRowKeys([]);
        handleCancel();
      }}
      footer={[
        <Button
          onClick={() => {
            /** 关闭弹窗取消弹窗表格选中 */
            setSelectedRowKeys([]);
            handleCancel();
          }}
        >
          {I18N.Factors.cancel}
        </Button>,
        <Button
          loading={confirmLoading}
          disabled={disabled}
          onClick={async () => {
            handleOk({ selectRows, selectedRowKeys });
            /** 关闭弹窗取消弹窗表格选中 */
            setSelectedRowKeys([]);
          }}
          type='primary'
        >
          {I18N.carbonFootPrintLCA.confirm}
        </Button>,
      ]}
    >
      <CustomTableRender<GeneralInfoProps, CbamRequest>
        tableRef={tableRef}
        searchProps={{
          schema: searchSchema({
            orgList,
          }),
          searchOnMount: false,
          api: searchApi,
        }}
        tableProps={{
          columns: columns(),
          scroll: { x: 1400, y: 300 },
          rowSelection: {
            type: 'radio',
            columnWidth: 48,
            ...rowSelection,
          },
          rowKey: 'id',
        }}
        autoAddIndexColumn
        autoFixNoText
      />
    </Modal>
  );
};

export default ChooseCbamModel;
