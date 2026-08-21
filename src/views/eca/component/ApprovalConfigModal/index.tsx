/**
 * @description 审批配置弹窗-模型
 */
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Button } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import usePageType from '@/hooks/usePageType';
import { PageTypeInfo } from '@/router/utils/enums';

import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { ApprovalConfigReq, ApprovalConfigResp } from './type';
import ApprovalInfoDrawer from '../ApprovalInfoDrawer';
import { getApprovalConfigList } from './service';
import { getAccountModelDetailApi } from '../../accountingModel/Info/service';
import { AccountModelInfoReqRequest } from '../../accountingModel/Info/type';

interface ApprovalConfigModalProps {
  /** 是否是详情页面 */
  isDetail: boolean;
  /** 模型id */
  modelId: string;
  /** 弹窗显隐 */
  open: boolean;
  /** 点击取消按钮的方法 */
  onClose: () => void;
}

const ApprovalConfigModal = ({
  isDetail,
  modelId,
  open,
  onClose,
}: ApprovalConfigModalProps) => {
  const { refresh, tableRef } = useTableRef();

  const { pageType, setModelAction: setActionBtnType } = usePageType(
    PageTypeInfo.edit,
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  /** 审批类型 1 模型；2 核算排放源 */
  const auditType = 1;

  /** 是否是批量编辑审批 */
  const [isBatchApproval, setIsBatchApproval] = useState(false);

  /** 当前行数据 */
  const [currentRow, setCurrentRow] = useState<ApprovalConfigResp>();

  /** 模型信息详情 */
  const [modelInfo, setModelInfo] = useState<AccountModelInfoReqRequest>();

  /** 表格选中项 */
  // const [selectRows, setSelectRows] = useState<ApprovalConfigResp[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 是否禁用 */
  const disabled = selectedRowKeys.length === 0 || isDetail;

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    // selectedRows: ApprovalConfigResp[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    // setSelectRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const searchApi: CustomSearchProps<
    ApprovalConfigResp,
    ApprovalConfigReq
  > = args =>
    getApprovalConfigList({
      ...args,
      modelId,
    }).then(({ data }) => {
      return {
        rows: data?.data || [],
        total: data?.data?.length || 0,
      };
    });

  /** 编辑方法 */
  const onEdit = (record: ApprovalConfigResp) => {
    setActionBtnType(PageTypeInfo.edit);
    setCurrentRow(record);
    setIsBatchApproval(false);
    setOpenDrawer(true);
  };

  /** 查看方法 */
  const onDetail = (record: ApprovalConfigResp) => {
    setActionBtnType(PageTypeInfo.show);
    setCurrentRow(record);
    setIsBatchApproval(false);
    setOpenDrawer(true);
  };

  /** 关闭操作 */
  const onInit = () => {
    setOpenDrawer(false);
    setCurrentRow(undefined);
    setActionBtnType(PageTypeInfo.show);
    setIsBatchApproval(false);
  };

  /** 获取模型信息详情 */
  const getDataAnalysisModelInfo = async () => {
    const { data: detailData } = await getAccountModelDetailApi(
      Number(modelId),
    );

    setModelInfo(detailData?.data || {});
  };

  useEffect(() => {
    if (!open || !modelId) return;
    getDataAnalysisModelInfo();
  }, [modelId, open]);

  return (
    <Modal
      wrapClassName={style.wrapper}
      centered
      title='审批配置'
      open={open}
      width='88%'
      maskClosable={false}
      destroyOnClose
      onCancel={() => {
        /** 关闭弹窗取消弹窗表格选中 */
        setSelectedRowKeys([]);
        onClose();
      }}
      footer={[
        <Button
          disabled={disabled}
          onClick={async () => {
            setCurrentRow(undefined);
            setIsBatchApproval(selectedRowKeys?.length > 1);
            setOpenDrawer(true);
          }}
          type='primary'
        >
          批量编辑审批
        </Button>,
      ]}
    >
      <div className={style.tipWrapper}>
        <div className={style.tipTitle}>
          <InfoCircleOutlined className={style.tipIcon} />
          <span>提示</span>
        </div>
        <p>
          如排放源已经在审批流程中，无法更改审批配置，请先将排放源审核退回。如排放源审核状态为审核通过，则在当前核算中不允许再更改审批配置。
        </p>
      </div>
      <div className={style.tableWrapper}>
        <CustomTableRender<ApprovalConfigResp, ApprovalConfigReq>
          tableRef={tableRef}
          searchProps={{
            schema: searchSchema(),
            api: searchApi,
            searchOnMount: false,
          }}
          tableProps={{
            columns: columns({
              onDetail,
              onEdit,
              isDetail,
            }),
            rowSelection: {
              type: 'checkbox',
              columnWidth: 48,
              ...rowSelection,
            },
            scroll: { x: 1200, y: 300 },
            pagination: false,
          }}
          autoFixNoText
        />
      </div>

      {/* 审批配置抽屉 */}
      <ApprovalInfoDrawer
        isBatchApproval={isBatchApproval}
        orgCode={modelInfo?.orgCode}
        auditType={auditType}
        emissionSourceIdList={
          isBatchApproval
            ? compact(selectedRowKeys?.map(key => Number(key)))
            : compact(
                [currentRow?.id || selectedRowKeys?.[0]]?.map(i => Number(i)),
              )
        }
        actionType={pageType}
        visible={openDrawer}
        onOk={() => {
          setOpenDrawer(false);
          /** 取消弹窗表格选中 */
          setSelectedRowKeys([]);
          refresh?.({ stay: true, tab: 1 });
        }}
        onClose={() => {
          onInit();
        }}
      />
    </Modal>
  );
};
export default ApprovalConfigModal;
