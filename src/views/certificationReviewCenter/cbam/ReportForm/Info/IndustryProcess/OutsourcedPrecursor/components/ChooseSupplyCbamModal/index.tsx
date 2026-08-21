/**
 * @description 选择供应商CBAM弹窗
 */
import I18N from '@src/lang/I18N';
import { Modal, Button } from 'antd';
import { FC, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle } from '@/utils';

import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getChooseSupplyCbamList } from './service';
import { ChooseSupplyCbamRequest, SupplyInfo } from './type';

/** 审批通过 */
const APPROVED = 4;

interface ChooseSupplyCbamModalProps {
  /** 弹窗显隐 */
  open: boolean;
  /** 点击取消按钮的方法 */
  handleCancel: () => void;
  /** 点击确定按钮的方法 */
  handleOk: (data?: {
    selectRows?: SupplyInfo[];
    selectedRowKeys?: React.Key[];
  }) => void;
}

const ChooseSupplyCbamModal: FC<ChooseSupplyCbamModalProps> = ({
  open,
  handleCancel,
  handleOk,
}) => {
  const navigate = useNavigate();

  const { tableRef } = useTableRef();

  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<SupplyInfo[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 是否禁用 */
  const disabled = selectedRowKeys.length === 0;

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: SupplyInfo[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const isFirstLoad = useRef(true);

  // 展示过审的供应商CBAM前体数据
  const searchApi: CustomSearchProps<
    SupplyInfo,
    ChooseSupplyCbamRequest
  > = args =>
    getChooseSupplyCbamList({
      ...args,
      applyStatus: APPROVED,
      type: 1,
    }).then(({ data }) => {
      /** 默认选中第一个 */
      if (isFirstLoad?.current && data?.data?.list?.length) {
        setSelectedRowKeys([Number(data?.data?.list?.[0]?.id)]);
      }
      isFirstLoad.current = false;
      return data?.data;
    });

  return (
    <Modal
      wrapClassName={style.wrapper}
      centered
      title={I18N.cbam.selectSupplier}
      open={open}
      width='70%'
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
          disabled={disabled}
          onClick={async () => {
            /** 二次确认弹窗 */
            modal.confirm({
              title: I18N.Factors.prompt,
              icon: '',
              content: (
                <div>
                  <div>{I18N.cbam.confirmSelectionOfNew}</div>
                  <div className={style.confirmModalTip}>
                    {I18N.cbam.noteToReselect2}
                  </div>
                </div>
              ),
              ...modelFooterBtnStyle,
              okText: I18N.base.confirm,
              cancelText: I18N.Factors.cancel,
              onOk: async () => {
                handleOk({ selectRows, selectedRowKeys });
                /** 关闭弹窗取消弹窗表格选中 */
                setSelectedRowKeys([]);
              },
            });
          }}
          type='primary'
        >
          {I18N.carbonFootPrintLCA.confirm}
        </Button>,
      ]}
    >
      <div className={style.tableModalWrapper}>
        <CustomTableRender<SupplyInfo, ChooseSupplyCbamRequest>
          tableRef={tableRef}
          searchProps={{
            schema: searchSchema(),
            api: searchApi,
            searchOnMount: false,
          }}
          tableProps={{
            columns: columns({ navigate }),
            rowSelection: {
              type: 'radio',
              columnWidth: 48,
              ...rowSelection,
            },
            rowKey: 'id',
            scroll: { y: 500 },
          }}
          autoFixNoText
        />
      </div>
    </Modal>
  );
};
export default ChooseSupplyCbamModal;
