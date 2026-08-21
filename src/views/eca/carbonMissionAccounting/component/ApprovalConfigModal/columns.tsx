import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';

import { ColumnsActionType, reviewStatusMap } from '../../config';
import { ComputationSourceGroupResp, ComputationSourceResp } from '../../type';
import { DATA_COLLECTION_PERIOD_OPTIONS } from '../FillingDeadlineModal/schemas';

const { REVIEW } = ColumnsActionType;

const { UN: RE_UN, UN_REVIEW, REVIEW_NOT_PASS } = reviewStatusMap;

/** 碳排放核算/任务样式/排放源列表 */
export const taskColumns = ({
  handleActionClick,
}: {
  handleActionClick: (
    actionType: ColumnsActionType,
    record: ComputationSourceGroupResp,
  ) => void;
}): ProColumns<ComputationSourceGroupResp>[] => [
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
    // hideInSearch: true,
    width: 880,
  },
  // {
  //   title: I18N.eca.emissionsTC,
  //   dataIndex: 'carbonEmission',
  //   hideInSearch: true,
  //   ellipsis: true,
  // },
  {
    title: '是否需要审批',
    dataIndex: 'requiredAudit',
    hidden: true,
    valueType: 'select',
    fieldProps: {
      placeholder: '是否需要审批',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    formItemProps: {
      name: 'requiredAudit',
      label: false,
    },
  },
  {
    title: '数据收集周期',
    dataIndex: 'dataPeriod',
    hidden: true,
    valueType: 'cascader',
    fieldProps: {
      placeholder: '数据收集周期',
      options: DATA_COLLECTION_PERIOD_OPTIONS,
      showSearch: true,
      expandTrigger: 'hover',
      changeOnSelect: true,
      filterOption: (input: string, option: any) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
    },
    formItemProps: {
      name: 'dataPeriod',
      label: false,
    },
  },
  {
    title: I18N.Factors.operation,
    valueType: 'option',
    width: 80,
    fixed: 'right',
    render: (_, record) => {
      return (
        <TableActions
          menus={compact([
            checkAuth('', {
              label: '编辑',
              key: '编辑',
              onClick: () => handleActionClick(REVIEW, record),
            }),
          ])}
        />
      );
    },
  },
];

/** 子表格列配置 */
export const subTableColumns = ({
  handleSubActionClick,
  dataPeriodName,
}: {
  handleSubActionClick: (
    actionType: ColumnsActionType,
    record: ComputationSourceResp,
  ) => void;
  dataPeriodName?: string;
}): ProColumns<ComputationSourceResp>[] => [
  {
    title: dataPeriodName,
    dataIndex: 'dataPeriodIdx',
    ellipsis: true,
    width: 200,
  },
  {
    title: I18N.eca.informant,
    dataIndex: 'roleNames',
    hideInSearch: true,
    width: 80,
  },
  {
    title: '关联用户',
    dataIndex: 'relUserDesc',
    hideInSearch: true,
    width: 300,
  },
  {
    title: '审批配置',
    dataIndex: 'auditConfigDesc',
    hideInSearch: true,
    width: 300,
  },
  {
    title: I18N.Factors.operation,
    valueType: 'option',
    width: 180,
    fixed: 'right',
    render: (_, record) => {
      const { reviewStatus } = record;
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
      return (
        <TableActions
          menus={compact([
            checkAuth('', {
              label: '编辑',
              key: '编辑',
              disabled: isDisabled,
              onClick: () => handleSubActionClick(REVIEW, record),
            }),
          ])}
        />
      );
    },
  },
];
