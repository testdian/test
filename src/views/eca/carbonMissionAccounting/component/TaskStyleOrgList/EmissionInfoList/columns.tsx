import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { getComputationEnumsEnumName } from '@/sdks/computation/computationV2ApiDocs';
import { CustomTag } from '@/views/components/CustomTag';

import { EnumOptionResp, getEnumOption } from '../../../../hooks';
import {
  ColumnsActionType,
  fillStatusOptions,
  matchFactorStatusMap,
  reviewStatusOptions,
} from '../../../config';
import { ComputationSourceRequest, ComputationSourceResp } from '../../../type';
import { getCarbonTaskActions } from '../../../utils/renderActionsButton';

const { VIEW, EDIT, DELETE, REVIEW, MATCH_FACTOR } = ColumnsActionType;

const { WAIT_MATCH_FACTOR } = matchFactorStatusMap;

/** 碳排放核算/任务样式/排放源组列表 */
export const taskColumns = (
  handleActionClick: (
    actionType: ColumnsActionType,
    record: ComputationSourceRequest,
  ) => void,
  emailSendStatusOptions: EnumOptionResp[],
  calculating: boolean,
  emissionUnit = '',
): ProColumns<ComputationSourceRequest>[] => [
  {
    title: I18N.eca.emissionSourceName,
    dataIndex: 'sourceName',
    fieldProps: {
      placeholder: I18N.eca.emissionSourceName,
    },
    formItemProps: {
      name: 'likeSourceName',
      label: undefined,
    },
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: `排放量${emissionUnit}`,
    dataIndex: 'carbonEmission',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    // 待填报、1 填报中、3已撤回、
    title: I18N.cbam.fillInStatus,
    dataIndex: 'fillStatus_name',
    hidden: true,
    valueType: 'select',
    fieldProps: {
      placeholder: I18N.cbam.fillInStatus,
      // options: fillStatusOptions,
    },
    request: async () => {
      const { data } = await getComputationEnumsEnumName({
        enumName: 'FillStatus',
      });
      const newArr = getEnumOption(data?.data || []);
      return newArr;
    },
    formItemProps: {
      name: 'fillStatus',
      label: false,
    },
    render: (_, record) => {
      const fillStatusName = record.fillStatus_name || '';

      /** 0 - 、1 - 未填报、2 - 填报中、3 - 填报完成 */
      const status = {
        0: 'grey',
        1: 'red',
        2: 'gold',
        3: 'green',
      };

      return (
        <CustomTag
          color={status[record.fillStatus as keyof typeof status]}
          text={fillStatusName}
        />
      );
    },
  },
  {
    title: I18N.supplyChainCarbonManagement.reviewStatus,
    dataIndex: 'reviewStatus_name',
    hidden: true,
    valueType: 'select',
    fieldProps: {
      placeholder: I18N.supplyChainCarbonManagement.reviewStatus,
      options: reviewStatusOptions,
    },
    formItemProps: {
      name: 'reviewStatus',
      label: false,
    },
  },
  {
    title: '是否已发送通知',
    dataIndex: 'emailStatus_name',
    hidden: true,
    valueType: 'select',
    fieldProps: {
      placeholder: '是否已发送通知',
      options: emailSendStatusOptions,
    },
    formItemProps: {
      name: 'emailStatus',
      label: false,
    },
  },
  {
    title: I18N.Factors.operation,
    valueType: 'option',
    width: 260,
    fixed: 'right',
    render: (_, record) => {
      const actions = {
        [VIEW]: {
          label: () => I18N.Factors.check,
          auth: '/carbonMissionAccounting/show',
        },
        [EDIT]: {
          label: () => '编辑排放源',
          auth: '/carbonMissionAccounting/edit',
        },
        [DELETE]: {
          label: () => I18N.Factors.delete,
          auth: '/carbonMissionAccountingInfo/del',
        },
      };

      // 新增自定义按钮
      const customButton = {
        type: ColumnsActionType.EDIT_FACTOR,
        config: {
          // 按钮权限码
          auth: '/carbonMissionAccounting/editFactor',
          // 按钮显示文本
          label: I18N.eca.editFactors,
        },
      };

      return (
        <TableActions
          menus={compact([
            // 查看
            checkAuth(actions[VIEW].auth, {
              label: actions[VIEW].label(),
              key: actions[VIEW].label(),
              onClick: () => handleActionClick(VIEW, record),
            }),
            // 编辑排放源
            checkAuth(actions[EDIT].auth, {
              label: actions[EDIT].label(),
              key: actions[EDIT].label(),
              onClick: () => handleActionClick(EDIT, record),
            }),
            // 删除
            checkAuth(actions[DELETE].auth, {
              label: actions[DELETE].label(),
              key: actions[DELETE].label(),
              onClick: () => handleActionClick(DELETE, record),
            }),
            // 编辑因子
            checkAuth(customButton.config.auth, {
              label: customButton.config.label,
              key: customButton.config.label,
              disabled: calculating,
              onClick: () =>
                handleActionClick(
                  customButton.type as ColumnsActionType,
                  record,
                ),
            }),
            // 重算
            checkAuth('/carbonMissionAccounting/manualCalc', {
              label: I18N.eca.recalculate,
              key: I18N.eca.recalculate,
              disabled: calculating,
              onClick: () =>
                handleActionClick(ColumnsActionType.RECALCULATE, record),
            }),
            // 复制到排放源库
            {
              label: '复制到排放源库',
              key: '复制到排放源库',
              onClick: () =>
                handleActionClick(
                  ColumnsActionType.COPY_TO_SOURCE_LIBRARY,
                  record,
                ),
            },
          ])}
        />
      );
    },
  },
];

/** 子表格列配置 */
export const subTableColumns = ({
  calculating,
  handleActionClick,
  dataPeriodName,
  dataPeriod,
}: {
  calculating: boolean;
  handleActionClick: (
    actionType: ColumnsActionType,
    record: ComputationSourceResp,
  ) => void;
  dataPeriodName?: string;
  dataPeriod?: number;
}): ProColumns<ComputationSourceResp>[] => [
  {
    title: dataPeriodName,
    dataIndex: 'dataPeriodIdx',
    ellipsis: true,
    width: 200,
    render: (_, record) => {
      // 如果周期是年份（dataPeriod为1），则显示固定文案"年份"
      if (dataPeriod === 1) {
        return '年份';
      }
      return record.dataPeriodIdx ?? '-';
    },
  },
  {
    // 待填报、1 填报中、3已撤回、
    title: I18N.cbam.fillInStatus,
    dataIndex: 'fillStatus_name',
    valueType: 'select',
    fieldProps: {
      placeholder: I18N.cbam.fillInStatus,
      options: fillStatusOptions,
    },
    formItemProps: {
      name: 'fillStatus',
      label: false,
    },
    render: (_, record) => {
      const fillStatusName = record.fillStatus_name || '';

      /** 0 - 、1 - 未填报、2 - 填报中、3 - 填报完成 */
      const status = {
        0: 'grey',
        1: 'red',
        2: 'gold',
        3: 'green',
      };

      return (
        <CustomTag
          color={status[record.fillStatus as keyof typeof status]}
          text={fillStatusName}
        />
      );
    },
  },
  {
    title: I18N.supplyChainCarbonManagement.reviewStatus,
    dataIndex: 'reviewStatus_name',
    width: 120,
    ellipsis: true,
  },
  {
    title: I18N.eca.informant,
    dataIndex: 'roleNames',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '当前审核人',
    dataIndex: 'currAuditDesc',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '审核时间',
    dataIndex: 'auditTime',
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: I18N.eca.daysRemaining,
    dataIndex: 'remainingDay',
    hideInSearch: true,
    render: (_, record) => {
      const { remainingDay } = record || {};
      //  如果remainingDay存在并且小于0则则展示“已超期”
      if (remainingDay && remainingDay < 0) {
        return '已超期';
      }
      return remainingDay ?? '-';
    },
  },
  {
    title: I18N.Factors.operation,
    valueType: 'option',
    width: 260,
    fixed: 'right',
    render: (_, record) => {
      const actions = getCarbonTaskActions(record);

      return (
        <TableActions
          menus={compact([
            ...actions.map(({ type, config }) => {
              if (type === REVIEW) {
                // 审核按钮需要额外满足userBtnFlag为true且匹配因子状态不为待匹配才展示
                const showReviewBtn =
                  record.userBtnFlag &&
                  record.factorMatchStatus !== WAIT_MATCH_FACTOR;

                if (!showReviewBtn) {
                  return null;
                }
              }

              const labelText =
                typeof config.label === 'function'
                  ? (config.label as () => string)()
                  : config.label;

              return checkAuth(config.auth, {
                label: labelText,
                key: labelText,
                // 计算中禁用匹配因子按钮
                disabled: type === MATCH_FACTOR && calculating,
                onClick: () =>
                  handleActionClick(type as ColumnsActionType, record),
              });
            }),
            // 重算
            checkAuth('/carbonMissionAccounting/manualCalc', {
              label: I18N.eca.recalculate,
              key: I18N.eca.recalculate,
              disabled: calculating,
              onClick: () =>
                handleActionClick(ColumnsActionType.RECALCULATE, record),
            }),
          ])}
        />
      );
    },
  },
];
