/**
 * @description: 碳排放核算/任务样式/详情
 */
import {
  ArrowLeftOutlined,
  DownOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button, Space, Table } from 'antd';
import type { Key } from 'antd/es/table/interface';
import { compact } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AuditMoreModal } from '@/components/AuditMoreModal';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import usePageType from '@/hooks/usePageType';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle, Toast } from '@/utils';
import { EmailTemplateListType } from '@/views/dashborad/EmailSendingRecord/type';
import { getEmissionModalSourceListApi } from '@/views/eca/accountingModel/Info/service';
import { EmissionSourceList } from '@/views/eca/accountingModel/Info/type';
import { AccountModelResponse } from '@/views/eca/accountingModel/type';
import BatchUpdateFactorModal from '@/views/eca/component/BatchUpdateFactorModal';
import ChooseEmissionSource from '@/views/eca/component/ChooseEmissionSource';
import CustomProTable from '@/views/eca/component/CustomProTable';
import EmissionSourceDetailDrawer from '@/views/eca/component/EmissionSourceDetailDrawer';
import { ComputationEnums } from '@/views/eca/hooks';

import { taskColumns, subTableColumns } from './columns';
import styles from './index.module.less';
import {
  ColumnsActionType,
  fillStatusMap,
  matchFactorStatusMap,
  reviewStatusMap,
} from '../../../config';
import {
  addTaskEmissionSourceApi,
  batchAddToEmissionSourceLibApi,
  batchDeleteTaskEmissionSourceApi,
  deleteTaskEmissionSourceApi,
  getCalcCheckStatus,
  getTaskEmissionSourceListApi,
  withdrawTaskEmissionSourceApi,
  syncTaskEmissionSourceApi,
  recalculateTaskEmissionSourceApi,
  noNeedFillTaskEmissionSourceApi,
  recalculateTaskEmissionSourceGroupApi,
  batchNoNeedFillTaskEmissionSourceApi,
} from '../../../service';
import {
  AccountYearComputation,
  ComputationSourceGroupResp,
  ComputationSourceRequest,
} from '../../../type';
import ApprovalConfigModal from '../../ApprovalConfigModal';
import AuditOrCheckDetailDrawer, { PageAuditType } from '../../AuditDrawer';
import EditFactorDrawer from '../../EditFactorDrawer';
import EmailActionsButtons from '../../EmailActionsButtons';
import EmailManagement from '../../EmailManagement';
import FillingDeadlineModal from '../../FillingDeadlineModal';
import MatchFactorModal from '../../MatchFactorModal';
import {
  calcEmissionSourceFactorApi,
  calcEmissionSourceGroupFactorApi,
} from '../../MatchFactorModal/service';
import ModelRefModal from '../../ModelRefModal';
import { selectModelApi } from '../../ModelRefModal/service';
import SendFillingTaskDrawer from '../../SendFillingTaskDrawer';
import { dataPeriodMap } from '../constant';
import { sendDingTaskApi } from '../service';
import { ComputationOrgTreeResp } from '../type';
// import { getEmissionModalSourceListApi } from '../accountingModel/Info/service';

const { UN, UN_FILL, FILLING, FILL_COMPLETE } = fillStatusMap;

const { UN: RE_UN, UN_REVIEW, REVIEW_PASS } = reviewStatusMap;

const { add } = PageTypeInfo;

const { WAIT_MATCH_FACTOR } = matchFactorStatusMap;

/** 子表格批量操作组件的渲染函数工厂 */
const createSubTableAlertRender = ({
  parentRecord,
  parentId,
  subSelectedRowKeys,
  onClearSubSelected,
  onReload,
  handleBatchReview,
}: {
  parentRecord: ComputationSourceGroupResp;
  parentId: string | number;
  subSelectedRowKeys: Record<string | number, Key[]>;
  onClearSubSelected: (parentId: string | number) => void;
  onReload: () => void;
  handleBatchReview: (idList: number[], successCallback: () => void) => void;
}) => {
  // 子表格数据
  const { computationSourceList } = parentRecord;

  // 审核 - 填报完成-未审核 需要满足userBtnFlag为true才展示
  // 检查是否存在需要审核的项（填报完成-未审核 且 userBtnFlag 为 true）
  const hasNeedReviewItem = computationSourceList?.some(item => {
    const statusKey = `${item.fillStatus}-${item.reviewStatus}`;
    return (
      statusKey === `${FILL_COMPLETE}-${UN_REVIEW}` && item.userBtnFlag === true
    );
  });

  // 退回 - 填报完成-审核通过
  // 检查是否存在"填报完成-审核通过"的项
  const hasReviewPassedItem = computationSourceList?.some(item => {
    const statusKey = `${item.fillStatus}-${item.reviewStatus}`;
    return statusKey === `${FILL_COMPLETE}-${REVIEW_PASS}`;
  });

  // 无需填报 - 未填报-未审核、填报中-未审核
  // 检查是否存在需要填报的项（未填报-未审核 或 填报中-未审核）
  const hasNeedFillItem = computationSourceList?.some(item => {
    const statusKey = `${item.fillStatus}-${item.reviewStatus}`;
    return (
      statusKey === `${UN_FILL}-${RE_UN}` || statusKey === `${FILLING}-${UN}`
    );
  });

  return ({ onCleanSelected }: { onCleanSelected: () => void }) => {
    const currentSubSelectedIds =
      (subSelectedRowKeys[parentId] as number[]) || [];

    return (
      <Space size={16}>
        <Button
          key='deselectSub'
          type='link'
          onClick={() => {
            onCleanSelected();
            onClearSubSelected(parentId);
          }}
        >
          {I18N.eca.deselect}
        </Button>
        {hasNeedReviewItem &&
          checkAuth(
            '/carbonMissionAccountingInfo/allDel',
            <Button
              key='auditSub'
              type='primary'
              disabled={currentSubSelectedIds.length === 0}
              onClick={() => {
                // 调用批量审核方法，传入选中的子表格项，成功回调
                handleBatchReview(currentSubSelectedIds, () => {
                  onCleanSelected();
                  onClearSubSelected(parentId);
                  onReload();
                });
              }}
            >
              {I18N.eca.toExamine}
            </Button>,
          )}
        {hasReviewPassedItem &&
          checkAuth(
            '/carbonMissionAccountingInfo/allDel',
            <Button
              key='withdrawSub'
              type='primary'
              disabled={currentSubSelectedIds.length === 0}
              onClick={() => {
                // 处理撤回逻辑
                modal.confirm({
                  title: I18N.Factors.prompt,
                  content: '确认退回所选排放源？',
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                  onOk: async () => {
                    await withdrawTaskEmissionSourceApi({
                      idList: currentSubSelectedIds,
                    });
                    onCleanSelected();
                    onClearSubSelected(parentId);
                    onReload();
                  },
                });
              }}
            >
              退回
            </Button>,
          )}
        {hasNeedFillItem &&
          checkAuth(
            '/carbonMissionAccountingInfo/allDel',
            <Button
              key='noNeedFillSub'
              type='primary'
              disabled={currentSubSelectedIds.length === 0}
              onClick={() => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  content: '确认将所选排放源设置为无需填报？',
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                  onOk: async () => {
                    await batchNoNeedFillTaskEmissionSourceApi({
                      idList: currentSubSelectedIds,
                    });
                    onCleanSelected();
                    onClearSubSelected(parentId);
                    onReload();
                  },
                });
              }}
            >
              无需填报
            </Button>,
          )}
      </Space>
    );
  };
};

interface CarbonEmissionDetailProps {
  hasAccountingTask: AccountYearComputation;
  currentYear: number;
  baseInfo: ComputationOrgTreeResp;
  onBackOrgList?: () => void;
}

const CarbonEmissionDetail = ({
  hasAccountingTask = {},
  currentYear,
  baseInfo,
  onBackOrgList,
}: CarbonEmissionDetailProps) => {
  const { code: orgCode = '', name: orgName } = baseInfo;

  /** 核算id */
  const computationId = Number(hasAccountingTask?.id);

  /** 排放量单位 */
  const emissionUnit = hasAccountingTask?.emissionUnit_name
    ? `（${hasAccountingTask?.emissionUnit_name}）`
    : '';

  /** 邮件状态枚举 */
  const emailSendStatusOptions = ComputationEnums('SourceEmailStatus');

  const tableRef = useRef<ActionType>();

  const { tableRef: emailManageTableRef } = useTableRef();

  const { pageType, setModelAction } = usePageType(add);

  /** 排放源id */
  const [emissionSourceId, setEmissionSourceId] = useState<number>();

  /** 设置排放源弹窗loading */
  const [chooseEmissionSourceLoading, setChooseEmissionSourceLoading] =
    useState(false);

  /** 选择排放源库弹窗 */
  const [chooseEmissionSourceVisible, setChooseEmissionSourceVisible] =
    useState(false);

  /** 新增排放源弹窗中的排放源库列表数据 */
  const [modalEmissionSource, setModalEmissionSourceList] = useState<
    EmissionSourceList[]
  >([]);

  /** 设置弹窗显示 */
  const [modalStatus, setModalStatus] = useState({
    /** 一键发送钉钉通知弹窗 */
    dingTalkVisible: false,
    /** 截止时间弹窗 */
    deadlineVisible: false,
    /** 邮件管理弹窗 */
    emailVisible: false,
    /** 发送任务弹窗 */
    sendTaskVisible: false,
    /** 匹配因子弹窗 */
    matchFactorVisible: false,
    /** 排放源编辑信息弹窗  */
    emissionSourceDetailVisible: false,
    /** 编辑因子弹窗 */
    editFactorVisible: false,
    /** 引用模型弹窗 */
    modelRefVisible: false,
    /** 审批设置弹窗 */
    approvalSettingVisible: false,
    /** 审核/详情抽屉 */
    auditOrDetailVisible: false,
    /** 批量更新因子弹窗 */
    batchUpdateFactorVisible: false,
  });

  /** 设置邮件详情信息 */
  const [emailTemplateDetail, setEmailTemplateDetail] =
    useState<EmailTemplateListType>();
  /** 设置匹配因子的 id 值 */
  const [matchFactorId, setMatchFactorId] = useState<number>();

  /** 排放源详情数据 */
  const [emissionSourceDetail, setEmissionSourceDetail] =
    useState<ComputationSourceGroupResp>();

  /** 否是计算中--禁用操作按钮 */
  const [calculating, setCalculating] = useState(false);

  /** 主表格选中的行key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  /** 子表格选中的行key（按主表格id分组） */
  const [subSelectedRowKeys, setSubSelectedRowKeys] = useState<
    Record<string | number, Key[]>
  >({});

  /** 是否是排放源组（一级） */
  const [isGroup, setIsGroup] = useState(false);

  /** 展开的行keys */
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

  /** 所有可展开的行keys */
  const [allExpandableKeys, setAllExpandableKeys] = useState<Key[]>([]);

  /** 查询计算状态 */
  const getCalculatingStatus = () => {
    getCalcCheckStatus().then(({ data }) => {
      const currUpdating = !!data?.data;
      setCalculating(currUpdating);
    });
  };

  useEffect(() => {
    getCalculatingStatus();

    // 定时器
    const timer = setInterval(() => {
      getCalculatingStatus();
    }, 1000);

    // 卸载时清除
    return () => clearInterval(timer);
  }, []);

  /** 关闭弹窗 */
  const toggleModal = (modalName: keyof typeof modalStatus, open: boolean) => {
    setModalStatus(prev => ({
      ...prev,
      [modalName]: open,
    }));
  };

  /** 获取新增排放源弹窗中的数据  */
  const getEmissionSourceListByGhgClassify = async () => {
    setChooseEmissionSourceLoading(true);
    const { data } = await getEmissionModalSourceListApi({
      computationId,
      orgCode,
    }).finally(() => {
      setChooseEmissionSourceLoading(false);
    });
    setModalEmissionSourceList(data?.data);
  };

  /** 勾选批量操作按钮 一级排放源组 */
  const tableAlertOptionRenderGroup = ({
    selectedRowKeys: mainSelectedKeys,
    onCleanSelected,
  }: {
    selectedRowKeys: (string | number)[];
    onCleanSelected: () => void;
  }) => {
    // 收集所有选中的id（只要主表格选中的id）
    const allSelectedIds = mainSelectedKeys;

    return (
      <Space size={16}>
        <Button
          key='deselectGroup'
          type='link'
          onClick={() => {
            onCleanSelected();
            setSubSelectedRowKeys({});
          }}
        >
          {I18N.eca.deselect}
        </Button>
        <Button
          key='batchCopyToSourceLib'
          type='primary'
          onClick={() => {
            modal.confirm({
              title: I18N.Factors.prompt,
              content: '是否确认复制到排放源库？',
              okText: I18N.base.confirm,
              cancelText: I18N.Factors.cancel,
              onOk: async () => {
                await batchAddToEmissionSourceLibApi({
                  idList: allSelectedIds as number[],
                });
                Toast(
                  'success',
                  I18N.supplyChainCarbonManagement.operationSuccessful,
                );
                onCleanSelected();
              },
            });
          }}
        >
          批量复制到排放源库
        </Button>
        {checkAuth(
          '/carbonMissionAccountingInfo/allDel',
          <Button
            key='deleteGroup'
            type='primary'
            onClick={() => {
              modal.confirm({
                title: I18N.Factors.prompt,
                content:
                  '请注意：确认后将删除该排放源下所有季度或月份（如有）数据，无论是否完成填报。',
                onOk: async () => {
                  await batchDeleteTaskEmissionSourceApi({
                    idList: allSelectedIds as number[],
                  });
                  onCleanSelected();
                  setSubSelectedRowKeys({});
                  tableRef.current?.reload();
                },
                okText: I18N.carbonFootPrintLCA.confirm,
                cancelText: I18N.Factors.cancel,
              });
            }}
          >
            {I18N.eca.batchDeletion}
          </Button>,
        )}
      </Space>
    );
  };

  // 操作处理函数（使用类型判断）一级排放源组
  const handleActionClickGroup = async (
    actionType: ColumnsActionType,
    record: ComputationSourceGroupResp,
  ) => {
    setIsGroup(true);
    switch (actionType) {
      case ColumnsActionType.VIEW:
        // 处理查看逻辑
        setEmissionSourceDetail(record);
        setModelAction(PageTypeInfo.show);
        toggleModal('auditOrDetailVisible', true);
        break;
      case ColumnsActionType.EDIT:
        // 处理编辑逻辑
        setEmissionSourceDetail(record);
        setModelAction(PageTypeInfo.edit);
        toggleModal('auditOrDetailVisible', true);
        break;
      case ColumnsActionType.DELETE:
        // 处理删除逻辑
        modal.confirm({
          title: I18N.Factors.prompt,
          width: 500,
          content: (
            <div>
              <p>请您确认是否删除整个排放源？</p>
              <p>
                请注意：确认后将删除该排放源下所有季度或月份（如有）数据，无论是否完成填报。
              </p>
            </div>
          ),
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await deleteTaskEmissionSourceApi({ id: record.id });
            tableRef.current?.reload();
          },
        });
        break;
      case ColumnsActionType.MATCH_FACTOR:
        // 处理匹配因子
        setMatchFactorId(record?.id);
        toggleModal('matchFactorVisible', true);
        setEmissionSourceDetail(record);
        break;
      case ColumnsActionType.EDIT_FACTOR:
        // 处理编辑因子
        setMatchFactorId(record?.id);
        setEmissionSourceDetail(record);
        toggleModal('editFactorVisible', true);
        break;
      case ColumnsActionType.SYNC_DATA:
        // 处理同步数据
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.eca.pleaseNoteToClick,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await syncTaskEmissionSourceApi({
              computationSourceId: record.id,
            });
            tableRef.current?.reload();
          },
        });
        break;
      case ColumnsActionType.RECALCULATE:
        // 处理重算
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.eca.pleaseNoteToClick2,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await recalculateTaskEmissionSourceGroupApi({
              groupId: record.id,
            });
            tableRef.current?.reload();
          },
        });
        break;
      case ColumnsActionType.COPY_TO_SOURCE_LIBRARY:
        // 复制到排放源库
        modal.confirm({
          title: I18N.Factors.prompt,
          content: '是否确认复制到排放源库？',
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await batchAddToEmissionSourceLibApi({ idList: [record.id] });
            Toast(
              'success',
              I18N.supplyChainCarbonManagement.operationSuccessful,
            );
          },
        });
        break;
      default:
        break;
    }
  };

  // 操作处理函数（使用类型判断）排放源
  const handleActionClick = async (
    actionType: ColumnsActionType,
    record: ComputationSourceGroupResp,
  ) => {
    setIsGroup(false);
    switch (actionType) {
      case ColumnsActionType.VIEW:
        // 处理查看逻辑
        setEmissionSourceDetail(record);
        setModelAction(PageTypeInfo.show);
        toggleModal('auditOrDetailVisible', true);
        break;
      case ColumnsActionType.EDIT:
        // 处理编辑逻辑
        setEmissionSourceDetail(record);
        setModelAction(PageTypeInfo.edit);
        toggleModal('auditOrDetailVisible', true);
        break;
      case ColumnsActionType.MATCH_FACTOR:
        // 处理匹配因子
        setMatchFactorId(record?.id);
        toggleModal('matchFactorVisible', true);
        setEmissionSourceDetail(record);
        break;
      case ColumnsActionType.EDIT_FACTOR:
        // 处理编辑因子
        setMatchFactorId(record?.id);
        setEmissionSourceDetail(record);
        toggleModal('editFactorVisible', true);
        break;
      case ColumnsActionType.REVIEW:
        // 处理审核
        setEmissionSourceDetail(record);
        setModelAction(PageAuditType.audit as unknown as PageTypeInfo);
        toggleModal('auditOrDetailVisible', true);
        break;
      case ColumnsActionType.WITHDRAW:
        // 处理撤回逻辑
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.eca.pleaseConfirmIfItIs4,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await withdrawTaskEmissionSourceApi({ idList: [record.id] });
            tableRef.current?.reload();
          },
        });
        break;
      case ColumnsActionType.SYNC_DATA:
        // 处理同步数据
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.eca.pleaseNoteToClick,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await syncTaskEmissionSourceApi({
              computationSourceId: record.id,
            });
            tableRef.current?.reload();
          },
        });
        break;
      case ColumnsActionType.RECALCULATE:
        // 处理重算
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.eca.pleaseNoteToClick2,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await recalculateTaskEmissionSourceApi({
              computationSourceId: record.id,
            });
            tableRef.current?.reload();
          },
        });
        break;
      case ColumnsActionType.NO_NEED_FILL:
        // 处理无需填报
        modal.confirm({
          title: I18N.Factors.prompt,
          content: '确认将该排放源设置为无需填报？',
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await noNeedFillTaskEmissionSourceApi({
              id: record.id,
            });
            tableRef.current?.reload();
          },
        });
        break;
      default:
        break;
    }
  };

  /** 清除指定子表格的选中状态 */
  const handleClearSubSelected = useCallback((parentId: string | number) => {
    setSubSelectedRowKeys(prev => {
      const newState = { ...prev };
      delete newState[parentId];
      return newState;
    });
  }, []);

  /** 重新加载表格 */
  const handleReload = useCallback(() => {
    tableRef.current?.reload();
  }, []);

  /** 当前选中的批量审核项 */
  const [currentBatchReviewIds, setCurrentBatchReviewIds] = useState<number[]>(
    [],
  );

  /** 批量审核弹窗显示状态 */
  const [auditModalVisible, setAuditModalVisible] = useState(false);

  /** 批量审核成功后的回调函数 */
  const [batchReviewSuccessCallback, setBatchReviewSuccessCallback] = useState<
    (() => void) | null
  >(null);

  /** 批量审核 */
  const handleBatchReview = useCallback(
    (idList: number[], successCallback: () => void) => {
      setCurrentBatchReviewIds(idList);
      setBatchReviewSuccessCallback(() => successCallback);
      setAuditModalVisible(true);
    },
    [],
  );

  /** 关闭或成功公共部分需要重置的初始化设置 */
  const onCloseOrSuccessInit = () => {
    toggleModal('emissionSourceDetailVisible', false);
    setEmissionSourceId(undefined);
  };

  /** 匹配因子计算 */
  const handleMatchFactor = async () => {
    try {
      if (!matchFactorId) return;
      if (isGroup) {
        await calcEmissionSourceGroupFactorApi({
          groupId: Number(matchFactorId),
        });
      } else {
        await calcEmissionSourceFactorApi({
          computationSourceId: Number(matchFactorId),
        });
      }
    } finally {
      setMatchFactorId(undefined);
      tableRef.current?.reload();
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
        key={`${parentId}-subTable`}
        columns={subTableColumns({
          calculating,
          handleActionClick,
          dataPeriodName,
          dataPeriod,
        })}
        dataSource={record.computationSourceList}
        rowKey='id'
        search={false}
        size='small'
        toolBarRender={false}
        pagination={false}
        scroll={{ x: 'max-content' }}
        tableAlertOptionRender={
          parentId
            ? createSubTableAlertRender({
                parentRecord: record,
                parentId,
                subSelectedRowKeys,
                onClearSubSelected: handleClearSubSelected,
                onReload: handleReload,
                handleBatchReview,
              })
            : undefined
        }
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
            const { fillStatus, reviewStatus, userBtnFlag, factorMatchStatus } =
              subRecord;
            const disabledKey = `${fillStatus}-${reviewStatus}`;
            const STATUS_ACTION_MAP: Record<string, boolean> = {
              // 无需填报 - 未填报-未审核、填报中-未审核
              // 未填报-未审核
              [`${UN_FILL}-${RE_UN}`]: false,
              // 填报中-未审核
              [`${FILLING}-${UN}`]: false,

              // 审核 - 填报完成-未审核 需要满足userBtnFlag为true且factorMatchStatus !== WAIT_MATCH_FACTOR才展示
              // 填报完成-未审核
              [`${FILL_COMPLETE}-${UN_REVIEW}`]:
                !userBtnFlag || factorMatchStatus === WAIT_MATCH_FACTOR,

              // 退回 - 填报完成-审核通过
              // 填报完成-审核通过
              [`${FILL_COMPLETE}-${REVIEW_PASS}`]: false,
            };

            // 未匹配的状态默认禁用（设置为 true）
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
    <div className={styles.carbonMissionMainContainerWrapper}>
      <div className={styles.orgHeaderWrapper}>
        <div
          className={styles.backOrgListWrapper}
          onClick={() => {
            onBackOrgList?.();
          }}
        >
          <ArrowLeftOutlined />
        </div>
        <div>核算组织：{orgName}</div>
      </div>
      <CustomProTable
        actionRef={tableRef}
        columns={taskColumns(
          handleActionClickGroup,
          emailSendStatusOptions,
          calculating,
          emissionUnit,
        )}
        apiRequest={getTaskEmissionSourceListApi}
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
          setAllExpandableKeys(keysToExpand || []);
          setExpandedRowKeys(keysToExpand || []);
          return data;
        }}
        tableAlertOptionRender={tableAlertOptionRenderGroup}
        headerTitle={
          <div className={styles.headerTitleWrapper}>
            <div className={styles.headerTitle}>
              <EmailActionsButtons
                onDingTask={() => {
                  // 一期先不做弹窗
                  // toggleModal('dingTalkVisible', true);
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <div>
                        针对内部用户，将向所有通知状态为未发送状态的排放源，对应的填报人发送钉钉通知。
                      </div>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: async () => {
                      // 直接调用接口发送钉钉通知
                      await sendDingTaskApi({
                        computationId,
                        orgCode,
                      });
                      Toast(
                        'success',
                        I18N.supplyChainCarbonManagement.operationSuccessful,
                      );
                    },
                  });
                }}
                onSendTask={() => {
                  toggleModal('sendTaskVisible', true);
                }}
                onSetDeadline={() => {
                  toggleModal('deadlineVisible', true);
                }}
                onEmailManagement={() => {
                  toggleModal('emailVisible', true);
                }}
                onApprovalSetting={() => {
                  toggleModal('approvalSettingVisible', true);
                }}
              />
              {calculating && (
                <div className={styles.calcTip}>
                  {I18N.eca.inDataCalculation}
                </div>
              )}
            </div>
            <div className={styles.expandAllBtnWrapper}>
              <Button
                type='link'
                icon={
                  expandedRowKeys.length === allExpandableKeys.length ? (
                    <UpOutlined />
                  ) : (
                    <DownOutlined />
                  )
                }
                onClick={() => {
                  // 判断当前是否全部展开：如果当前展开的数量等于可展开的总数，则收起所有；否则展开所有
                  if (expandedRowKeys.length === allExpandableKeys.length) {
                    setExpandedRowKeys([]);
                  } else {
                    setExpandedRowKeys(allExpandableKeys);
                  }
                }}
              >
                {expandedRowKeys.length === allExpandableKeys.length
                  ? '收起所有'
                  : '展开所有'}
              </Button>
            </div>
          </div>
        }
        toolBarRender={() => [
          <Button
            key='addEmission'
            type='primary'
            onClick={async () => {
              setChooseEmissionSourceVisible(true);
              await getEmissionSourceListByGhgClassify();
            }}
          >
            <PlusOutlined /> {I18N.eca.addNewEmissionSources}
          </Button>,
          checkAuth(
            '/carbonMissionAccounting/batchUpdateFactor',
            <Button
              key='batchUpdateFactor'
              disabled={calculating}
              onClick={() => toggleModal('batchUpdateFactorVisible', true)}
            >
              批量更新因子
            </Button>,
          ),
          <Button
            key='referenceModel'
            onClick={() => {
              modal.confirm({
                title: I18N.Factors.prompt,
                icon: '',
                content: (
                  <div>
                    如已有排放源正在填报中，重新引用模型，则数据将被清空。
                  </div>
                ),
                ...modelFooterBtnStyle,
                okText: I18N.base.confirm,
                cancelText: I18N.Factors.cancel,
                onOk: async () => {
                  toggleModal('modelRefVisible', true);
                },
              });
            }}
          >
            引用模型
          </Button>,
        ]}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          preserveSelectedRowKeys: true,
        }}
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
        scroll={{ x: 'max-content' }}
      />

      {/* 任务样式/截止时间弹窗 */}
      <FillingDeadlineModal
        computationId={computationId}
        orgCode={orgCode}
        visible={modalStatus.deadlineVisible}
        onClose={() => {
          toggleModal('deadlineVisible', false);
        }}
        onSuccess={() => {
          toggleModal('deadlineVisible', false);
          tableRef.current?.reload();
        }}
      />
      {/* 任务样式/邮箱管理弹窗 */}
      <EmailManagement
        visible={modalStatus.emailVisible}
        onClose={() => {
          toggleModal('emailVisible', false);
          setEmailTemplateDetail(undefined);
          setModelAction(add);
        }}
        sourceId={computationId}
        tableRef={emailManageTableRef}
      />
      {/* 任务样式/发送邮件抽屉 */}
      <SendFillingTaskDrawer
        orgCode={orgCode}
        currentYear={currentYear.toString()}
        visible={modalStatus.sendTaskVisible}
        onClose={() => {
          toggleModal('sendTaskVisible', false);
        }}
        actionType={pageType}
        onSuccessSave={() => {
          toggleModal('sendTaskVisible', false);
          setModelAction(add);
          emailManageTableRef?.current?.refresh();
        }}
        emailTemplateDetail={emailTemplateDetail as EmailTemplateListType}
        computationId={computationId}
      />
      {/* 任务样式/新增排放源库弹窗 */}
      <ChooseEmissionSource
        loading={chooseEmissionSourceLoading}
        modelId={Number(hasAccountingTask?.id)}
        emissionSource={modalEmissionSource}
        visible={chooseEmissionSourceVisible}
        currentGhgClassifyName={{
          name: I18N.eca.emissionSourceData,
        }}
        onCancel={() => {
          setEmissionSourceId(undefined);
          setChooseEmissionSourceVisible(false);
        }}
        onSaveSuccess={async (modelIdValue, selectedData) => {
          await addTaskEmissionSourceApi({
            computationId: Number(modelIdValue),
            emissionSourceCodeList: selectedData,
            orgCode,
          });
          Toast(
            'success',
            I18N.supplyChainCarbonManagement.operationSuccessful,
          );
          setChooseEmissionSourceVisible(false);
          tableRef.current?.reload();
        }}
        onEmissionItemModalClick={id => {
          setEmissionSourceId(id);
          toggleModal('emissionSourceDetailVisible', true);
        }}
      />
      {/* 任务样式/排放源详情数据/收集模板无用户的填报的数据抽屉 */}
      <EmissionSourceDetailDrawer
        visible={modalStatus.emissionSourceDetailVisible}
        onClose={() => {
          onCloseOrSuccessInit();
        }}
        emissionSourceId={Number(emissionSourceId)}
        actionType={PageTypeInfo.show}
      />
      {/* 任务样式/排放源审核/详情抽屉 */}
      <AuditOrCheckDetailDrawer
        isGroup={isGroup}
        computationSourceIdList={compact([emissionSourceDetail?.id])}
        visible={modalStatus.auditOrDetailVisible}
        actionType={pageType as unknown as PageTypeInfo & PageAuditType}
        emissionSourceDetail={emissionSourceDetail as ComputationSourceRequest}
        onClose={() => {
          setModelAction(add);
          setEmissionSourceDetail(undefined);
          toggleModal('auditOrDetailVisible', false);
        }}
        onSuccessSave={() => {
          Toast(
            'success',
            I18N.supplyChainCarbonManagement.operationSuccessful,
          );
          setModelAction(add);
          setEmissionSourceDetail(undefined);
          toggleModal('auditOrDetailVisible', false);
          tableRef.current?.reload();
        }}
      />
      {/* 任务样式/匹配因子弹窗 */}
      <MatchFactorModal
        matchFactorId={matchFactorId as number}
        visible={modalStatus.matchFactorVisible}
        emissionSourceDetail={emissionSourceDetail as ComputationSourceRequest}
        onCancel={async () => {
          toggleModal('matchFactorVisible', false);
          handleMatchFactor();
        }}
        onSave={async () => {
          toggleModal('matchFactorVisible', false);
          handleMatchFactor();
        }}
      />
      {/* 批量审核弹窗 */}
      <AuditMoreModal
        open={auditModalVisible}
        handleCancel={() => {
          setAuditModalVisible(false);
          setCurrentBatchReviewIds([]);
          setBatchReviewSuccessCallback(null);
        }}
        handleOk={() => {
          setAuditModalVisible(false);
          Toast(
            'success',
            I18N.supplyChainCarbonManagement.operationSuccessful,
          );
          // 调用批量审核的成功回调
          if (batchReviewSuccessCallback) {
            batchReviewSuccessCallback();
            setBatchReviewSuccessCallback(null);
          }
          setCurrentBatchReviewIds([]);
          tableRef.current?.reload();
        }}
        formValues={{
          computationSourceIdList: currentBatchReviewIds,
        }}
      />
      {/* 任务样式/编辑因子功能 */}
      <EditFactorDrawer
        computationSourceId={emissionSourceDetail?.id}
        emissionSourceId={emissionSourceDetail?.emissionSourceId as number}
        visible={modalStatus.editFactorVisible}
        onClose={() => {
          toggleModal('editFactorVisible', false);
          handleMatchFactor();
        }}
        onSuccessSave={() => {
          toggleModal('editFactorVisible', false);
          handleMatchFactor();
        }}
      />
      <BatchUpdateFactorModal
        open={modalStatus.batchUpdateFactorVisible}
        params={{ computationId, orgCode }}
        scene='taskEmissionSource'
        onCancel={() => {
          toggleModal('batchUpdateFactorVisible', false);
        }}
        onSuccess={() => {
          toggleModal('batchUpdateFactorVisible', false);
          tableRef.current?.reload();
          getCalculatingStatus();
        }}
      />
      {/* 任务样式/引用模型弹窗 */}
      <ModelRefModal
        onUseModelFn={(record: AccountModelResponse) => {
          modal.confirm({
            centered: true,
            title: I18N.Factors.prompt,
            closable: true,
            okText: I18N.base.confirm,
            cancelText: I18N.Factors.cancel,
            content: (
              <span>
                确认引用该模型：
                <span className='modal_text'>{record?.modelName}</span> ？
              </span>
            ),
            onOk: async () => {
              await selectModelApi({
                computationId,
                orgCode,
                modelId: record.id,
              });
              Toast(
                'success',
                I18N.supplyChainCarbonManagement.operationSuccessful,
              );
              toggleModal('modelRefVisible', false);
              tableRef.current?.reload();
            },
          });
        }}
        open={modalStatus.modelRefVisible}
        onCancel={() => {
          toggleModal('modelRefVisible', false);
        }}
      />

      {/* 审批配置弹窗 */}
      <ApprovalConfigModal
        orgCode={orgCode}
        computationId={computationId}
        open={modalStatus.approvalSettingVisible}
        onClose={() => {
          toggleModal('approvalSettingVisible', false);
        }}
      />
    </div>
  );
};

export default CarbonEmissionDetail;
