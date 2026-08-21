/**
 * @description 审批配置弹窗-核算
 */
import { InfoCircleOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Modal, Button, Table } from 'antd';
import { compact } from 'lodash-es';
import { Key, useRef, useState } from 'react';

import usePageType from '@/hooks/usePageType';
import { PageTypeInfo } from '@/router/utils/enums';
import CustomProTable from '@/views/eca/component/CustomProTable';

import ApprovalInfoDrawer from '../ApprovalInfoDrawer';
import { subTableColumns, taskColumns } from './columns';
import style from './index.module.less';
import { getApprovalConfigListApi } from './service';
import { ApprovalConfigResp } from './type';
import {
  ColumnsActionType,
  fillStatusMap,
  reviewStatusMap,
} from '../../config';
import { ComputationSourceGroupResp } from '../../type';
import { dataPeriodMap } from '../TaskStyleOrgList/constant';

const { UN, UN_FILL, FILLING } = fillStatusMap;

const { UN: RE_UN, UN_REVIEW, REVIEW_NOT_PASS } = reviewStatusMap;

interface ApprovalConfigModalProps {
  /** 核算id */
  computationId: number;
  /** 组织code */
  orgCode: string;
  /** 弹窗显隐 */
  open: boolean;
  /** 点击取消按钮的方法 */
  onClose: () => void;
}

const ApprovalConfigModal = ({
  computationId,
  orgCode,
  open,
  onClose,
}: ApprovalConfigModalProps) => {
  const tableRef = useRef<ActionType>();

  const { pageType, setModelAction: setActionBtnType } = usePageType(
    PageTypeInfo.edit,
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  /** 审批类型 1 模型；2 核算排放源 */
  const auditType = 2;

  /** 是否是批量编辑审批 */
  const [isBatchApproval, setIsBatchApproval] = useState(false);

  /** 展开的行keys */
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

  /** 当前主表格行数据 */
  const [currentRow, setCurrentRow] = useState<ApprovalConfigResp>();

  /** 当前子表格行数据 */
  const [currentSubRow, setCurrentSubRow] =
    useState<ComputationSourceGroupResp>();

  /** 主表格选中的行key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  /** 子表格选中的行key（按主表格id分组） */
  const [subSelectedRowKeys, setSubSelectedRowKeys] = useState<
    Record<string | number, Key[]>
  >({});

  /** 是否禁用 */
  const disabled = selectedRowKeys.length === 0;

  /** 关闭操作 */
  const onInit = () => {
    setOpenDrawer(false);
    setCurrentRow(undefined);
    setCurrentSubRow(undefined);
    setActionBtnType(PageTypeInfo.edit);
    setIsBatchApproval(false);
  };

  // 操作处理函数（使用类型判断）
  const handleActionClick = async (
    actionType: ColumnsActionType,
    record: ComputationSourceGroupResp,
  ) => {
    switch (actionType) {
      case ColumnsActionType.REVIEW:
        // 处理审核
        setCurrentRow(record);
        setIsBatchApproval(false);
        setOpenDrawer(true);
        break;
      default:
    }
  };

  // 操作子表格处理函数（使用类型判断）
  const handleSubActionClick = async (
    actionType: ColumnsActionType,
    record: ComputationSourceGroupResp,
  ) => {
    switch (actionType) {
      case ColumnsActionType.REVIEW:
        // 处理审核
        setCurrentSubRow(record);
        setIsBatchApproval(false);
        setOpenDrawer(true);
        break;
      default:
    }
  };

  /** 渲染子表格 */
  const renderSubTable = (record: ComputationSourceGroupResp) => {
    const {
      computationSourceList,
      dataPeriod = 1,
      id: parentId,
    } = record || {};
    const dataPeriodName =
      dataPeriodMap[dataPeriod as keyof typeof dataPeriodMap] || '周期';

    if (!computationSourceList || computationSourceList.length === 0) {
      return null;
    }

    // 获取当前子表格的选中状态
    const currentSubSelected = (parentId && subSelectedRowKeys[parentId]) || [];

    return (
      <ProTable
        columns={subTableColumns({
          handleSubActionClick,
          dataPeriodName,
        })}
        dataSource={record.computationSourceList}
        rowKey='id'
        search={false}
        size='small'
        toolBarRender={false}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys: currentSubSelected,
          onChange: (selectedKeys: Key[]) => {
            if (parentId) {
              setSubSelectedRowKeys(prev => ({
                ...prev,
                [parentId]: selectedKeys,
              }));
            }
          },
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          getCheckboxProps(subRecord) {
            const { reviewStatus } = subRecord;
            const disabledKey = `${reviewStatus}`;
            const STATUS_ACTION_MAP: Record<string, boolean> = {
              // 未审核
              [`${RE_UN}`]: false,
              // 未审核
              [`${UN_REVIEW}`]: false,
              // 审核不通过
              [`${REVIEW_NOT_PASS}`]: false,
            };
            // 其他状态默认禁用（设置为 true）
            const isDisabled = STATUS_ACTION_MAP[disabledKey] ?? true;
            return {
              disabled: isDisabled,
            };
          },
        }}
      />
    );
  };

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
        setSubSelectedRowKeys({});
        onClose();
      }}
      footer={[
        <Button
          disabled={disabled}
          onClick={async () => {
            setCurrentRow(undefined);
            setCurrentSubRow(undefined);
            setIsBatchApproval(true);
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
        <CustomProTable
          actionRef={tableRef}
          columns={taskColumns({
            handleActionClick,
          })}
          apiRequest={getApprovalConfigListApi}
          params={{ computationId, orgCode }}
          postData={(data: ComputationSourceGroupResp[]) => {
            // 数据加载成功后，自动展开所有有子数据的一级行
            const keysToExpand = data
              ?.filter(
                item =>
                  item.computationSourceList &&
                  item.computationSourceList.length > 0,
              )
              .map(item => item.id as Key);
            setExpandedRowKeys(keysToExpand || []);
            return data;
          }}
          handleRequestParams={args => {
            const dataPeriod = args?.dataPeriod?.[0] || undefined;
            const idx = args?.dataPeriod?.[1] || undefined;

            return {
              ...args,
              dataPeriod,
              idx,
            };
          }}
          toolBarRender={false}
          rowSelection={{
            selectedRowKeys,
            onChange: (
              newSelectedRowKeys: Key[],
              selectedRows: ComputationSourceGroupResp[],
            ) => {
              setSelectedRowKeys(newSelectedRowKeys);

              // 处理子表格的联动选中
              const newSubSelected = { ...subSelectedRowKeys };

              selectedRows.forEach(row => {
                // 如果该行有子表格数据，选中所有子表格的可选项
                if (
                  row.computationSourceList &&
                  row.computationSourceList.length > 0
                ) {
                  const selectableSubIds = row.computationSourceList
                    .filter((subRow: ComputationSourceGroupResp) => {
                      const { fillStatus, reviewStatus } = subRow;
                      const disabledKey = `${fillStatus}-${reviewStatus}`;
                      const STATUS_ACTION_MAP: Record<string, boolean> = {
                        [`${UN}-${RE_UN}`]: false,
                        [`${UN_FILL}-${RE_UN}`]: false,
                        [`${FILLING}-${UN}`]: false,
                      };
                      const isDisabled = STATUS_ACTION_MAP[disabledKey] ?? true;
                      return !isDisabled;
                    })
                    .map(
                      (subRow: ComputationSourceGroupResp) => subRow.id as Key,
                    );

                  if (row.id) {
                    newSubSelected[row.id] = selectableSubIds;
                  }
                }
              });

              // 移除未选中主表格行的子表格选中状态
              Object.keys(newSubSelected).forEach(parentId => {
                const parentKey = Number.isNaN(Number(parentId))
                  ? parentId
                  : Number(parentId);
                if (!newSelectedRowKeys.includes(parentKey)) {
                  delete newSubSelected[parentId];
                }
              });

              setSubSelectedRowKeys(newSubSelected);
            },
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }}
          tableAlertOptionRender={false}
          expandable={{
            rowExpandable: (record: ComputationSourceGroupResp) => {
              return !!(
                record.computationSourceList &&
                record.computationSourceList.length > 0
              );
            },
            expandedRowRender: renderSubTable,
            expandedRowKeys,
            onExpandedRowsChange: (expandedKeys: readonly Key[]) => {
              setExpandedRowKeys(expandedKeys as Key[]);
            },
          }}
          scroll={{ x: 'max-content', y: 400 }}
          pagination={false}
        />
      </div>

      {/* 审批配置抽屉 */}
      <ApprovalInfoDrawer
        isBatchApproval={isBatchApproval}
        orgCode={orgCode}
        auditType={auditType}
        groupIdList={
          isBatchApproval
            ? compact(selectedRowKeys?.map(key => Number(key)))
            : compact([currentRow?.id])
        }
        computationIdList={
          isBatchApproval
            ? compact(
                Object.values(subSelectedRowKeys)
                  ?.flat()
                  ?.map(key => Number(key)),
              )
            : compact([currentSubRow?.id])
        }
        actionType={pageType}
        visible={openDrawer}
        onOk={() => {
          setOpenDrawer(false);
          /** 取消弹窗表格选中 */
          setSelectedRowKeys([]);
          setSubSelectedRowKeys({});
          setIsBatchApproval(false);
          tableRef?.current?.reload();
        }}
        onClose={() => {
          onInit();
        }}
      />
    </Modal>
  );
};
export default ApprovalConfigModal;
