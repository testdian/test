/**
 * @@description: 手动同步弹窗
 */
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Modal, Row, Col, Divider } from 'antd';
import React, { useState, useRef, useMemo } from 'react';

import I18N from '@/lang/I18N';
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';

import {
  accountingEmissionSourceColumns,
  emissionSourceColumns,
} from './columns';
import styles from './index.module.less';
import {
  getEmissionSourceListApi,
  getAccountingEmissionSourceListApi,
  submitManualSyncApi,
  manualSyncEmissionSourceCheckApi,
} from '../../service';
import { SyncListResponse } from '../../type';

interface ManualSyncModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** 当前排放源id */
  emissionSourceId?: number;
  /** 核算年度列表 */
  yearArr: { label: string | number; value: string | number }[];
}

const ManualSyncModal: React.FC<ManualSyncModalProps> = ({
  visible,
  yearArr,
  onClose,
  onSuccess,
  emissionSourceId,
}) => {
  const leftActionRef = useRef<ActionType>();
  const rightActionRef = useRef<ActionType>();

  /** 核算中的排放源列表选中的id */
  const [groupIdList, setGroupIdList] = useState<React.Key[]>([]);

  /** 排放源库的排放源列表选中的id */
  const [emissionSourceIdList, setEmissionSourceIdList] = useState<React.Key[]>(
    [],
  );

  // 是否禁用确认按钮 - groupIdList 和 emissionSourceIdList 都未选时禁用
  const disabled = useMemo(() => {
    return groupIdList.length === 0 && emissionSourceIdList.length === 0;
  }, [groupIdList, emissionSourceIdList]);

  /** 提交loading */
  const [submitLoading, setSubmitLoading] = useState(false);

  /** 处理取消按钮 */
  const handleCancel = () => {
    setGroupIdList([]);
    setEmissionSourceIdList([]);
    onClose();
  };

  /** 核算中的排放源列表表格配置 */
  const groupRowSelection = {
    selectedRowKeys: groupIdList,
    onChange: (selectedRowKeys: React.Key[]) => {
      setGroupIdList(selectedRowKeys);
    },
  };

  /** 排放源库的排放源列表表格配置 */
  const emissionSourceRowSelection = {
    selectedRowKeys: emissionSourceIdList,
    onChange: (selectedRowKeys: React.Key[]) => {
      setEmissionSourceIdList(selectedRowKeys);
    },
  };

  /** 执行同步操作 */
  const executeSync = async () => {
    try {
      await submitManualSyncApi({
        id: emissionSourceId,
        groupIdList: groupIdList as number[],
        emissionSourceIdList: emissionSourceIdList as number[],
      });
      Toast('success', '已完成同步');
      onSuccess?.();
      handleCancel();
      return true;
    } catch (error) {
      console.error('同步失败:', error);
      throw error;
    }
  };

  /** 处理确认按钮 */
  const handleOk = async () => {
    try {
      setSubmitLoading(true);

      // 先调用校验接口
      const checkResult = await manualSyncEmissionSourceCheckApi({
        id: emissionSourceId,
        groupIdList: groupIdList as number[],
        emissionSourceIdList: emissionSourceIdList as number[],
      });

      // 需要同步
      const needAsync =
        checkResult?.data?.data && checkResult?.data?.data !== '0';

      // 如果有校验信息，显示二次确认弹窗
      if (needAsync) {
        // 重置主弹窗的 loading 状态
        setSubmitLoading(false);

        modal.confirm({
          title: '提示',
          content: checkResult.data.data,
          onOk: async () => {
            try {
              await executeSync();
            } catch (error) {
              console.error('同步失败:', error);
            }
          },
          okText: '确认',
          cancelText: '取消',
        });
      } else {
        // 如果没有校验信息，提示无需同步
        Toast('success', '核算中不存在此排放源，无需同步。');
        setSubmitLoading(false);
      }
    } catch (error) {
      console.error('校验失败:', error);
      setSubmitLoading(false);
    }
  };

  return (
    <Modal
      title='手动同步'
      open={visible}
      okButtonProps={{ disabled }}
      onOk={handleOk}
      onCancel={handleCancel}
      width='100%'
      confirmLoading={submitLoading}
      okText='确认'
      cancelText='取消'
      destroyOnHidden
      centered
    >
      <div className={styles.modalContent}>
        <Row gutter={0}>
          {/* 排放源库的排放源列表 */}
          <Col span={11}>
            <div className={styles.tableWrapper}>
              <div className={styles.tableTitle}>排放源库的排放源列表</div>
              <ProTable<SyncListResponse>
                actionRef={leftActionRef}
                columns={emissionSourceColumns}
                rowKey='id'
                scroll={{
                  x: 'max-content',
                  y: '45vh',
                }}
                options={false}
                search={{
                  layout: 'horizontal',
                  defaultCollapsed: false,
                  collapseRender: () => null,
                  searchText: I18N.prodManagement.query,
                  resetText: I18N.prodManagement.reset,
                  span: 8,
                }}
                pagination={false}
                rowSelection={emissionSourceRowSelection}
                request={async params => {
                  const { data } = await getEmissionSourceListApi({
                    ...params,
                    id: emissionSourceId,
                  });
                  return {
                    data: data?.data || [],
                    total: data?.data?.length || 0,
                    success: true,
                  };
                }}
              />
            </div>
          </Col>

          {/* 分割线 */}
          <Col span={2} style={{ display: 'flex', justifyContent: 'center' }}>
            <Divider type='vertical' style={{ height: '100%', margin: 0 }} />
          </Col>

          {/* 核算中的排放源列表 */}
          <Col span={11}>
            <div className={styles.tableWrapper}>
              <div className={styles.tableTitle}>核算中的排放源列表</div>
              <ProTable<SyncListResponse>
                actionRef={rightActionRef}
                columns={accountingEmissionSourceColumns(yearArr)}
                rowKey='id'
                scroll={{
                  x: 'max-content',
                  y: '45vh',
                }}
                options={false}
                search={{
                  layout: 'horizontal',
                  defaultCollapsed: false,
                  collapseRender: () => null,
                  searchText: I18N.prodManagement.query,
                  resetText: I18N.prodManagement.reset,
                  span: 8,
                }}
                pagination={false}
                rowSelection={groupRowSelection}
                request={async params => {
                  const { data } = await getAccountingEmissionSourceListApi({
                    ...params,
                    id: emissionSourceId,
                  });
                  return {
                    data: data?.data || [],
                    total: data?.data?.length || 0,
                    success: true,
                  };
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ManualSyncModal;
