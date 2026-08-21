import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Progress } from 'antd';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';

import { DATA_TYPE } from './constant';
import styles from './index.module.less';
import { ComputationOrgTreeResp, EmissionValue } from './type';
import { ColumnsActionType } from '../../config';

const { VIEW } = ColumnsActionType;

const ProgressList = ({
  defaultShowInfo,
}: {
  defaultShowInfo: EmissionValue;
}) => {
  const {
    approvedNum = 0,
    pendingNum = 0,
    notFilledNum = 0,
    totalNum = 0,
  } = defaultShowInfo || {};
  const list = [
    {
      label: '审核通过',
      value: approvedNum,
      total: totalNum,
      percent: Math.round((approvedNum / totalNum) * 100),
      color: '#67B034',
    },
    {
      label: '待审核',
      value: pendingNum,
      total: totalNum,
      percent: Math.round((pendingNum / totalNum) * 100),
      color: '#E71E19',
    },
    {
      label: '待填报',
      value: notFilledNum,
      total: totalNum,
      percent: Math.round((notFilledNum / totalNum) * 100),
      color: '#999',
    },
  ];

  return (
    <div className={styles.progressListWrapper}>
      {list.map(item => (
        <div className={styles.progressItem}>
          <span className={styles.progressText}>
            {item.label}({item.value}/{item.total})
          </span>
          <Progress
            percent={item.percent}
            className={styles.progressWrapper}
            strokeColor={item.color}
          />
        </div>
      ))}
    </div>
  );
};

/** 获取碳排放量 */
const getCarbonEmission = (
  record: ComputationOrgTreeResp,
  showTotalValueCodes: Set<string>,
) => {
  const { dataType, totalValue = {}, currValue = {}, code } = record || {};

  /** 自身无碳排放量 => 展示totalValue */
  const isNotSelf = dataType === DATA_TYPE.NOT_SELF;

  /** 如果该行切换到了合计值模式，展示 totalValue */
  const shouldShowTotal = showTotalValueCodes.has(code || '');

  const emission = isNotSelf || shouldShowTotal ? totalValue : currValue;

  return emission;
};

export const columns = (
  handleActionClick: (
    actionType: ColumnsActionType,
    record: ComputationOrgTreeResp,
  ) => void,
  showTotalValueCodes: Set<string>,
  toggleRowDisplayMode: (code: string) => void,
  emissionUnit = '',
): ProColumns<ComputationOrgTreeResp>[] => [
  {
    title: '核算组织',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '填报进度',
    dataIndex: 'currValue',
    ellipsis: true,
    width: 150,
    render: (_, record) => {
      const emission = getCarbonEmission(record, showTotalValueCodes);
      if (!emission) {
        return '-';
      }
      return <ProgressList defaultShowInfo={emission} />;
    },
  },
  {
    title: `总排放量${emissionUnit}`,
    dataIndex: 'totalEmission',
    render: (_, record) => {
      return (
        getCarbonEmission(record, showTotalValueCodes)?.totalEmission || '-'
      );
    },
  },
  {
    title: '范围一',
    dataIndex: 'scope1Emission',
    render: (_, record) => {
      return (
        getCarbonEmission(record, showTotalValueCodes)?.scope1Emission || '-'
      );
    },
  },
  {
    title: '范围二',
    dataIndex: 'scope2Emission',
    render: (_, record) => {
      return (
        getCarbonEmission(record, showTotalValueCodes)?.scope2Emission || '-'
      );
    },
  },
  {
    title: '范围三',
    dataIndex: 'scope3Emission',
    render: (_, record) => {
      return (
        getCarbonEmission(record, showTotalValueCodes)?.scope3Emission || '-'
      );
    },
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    fixed: 'right',
    render: (_, record) => {
      const { dataType, code, children } = record || {};

      /** 自身无碳排放量=不展示合计值按钮 */
      const isNotSelf = dataType === DATA_TYPE.NOT_SELF;

      /** 判断是否有子级 */
      const hasChildren = children && children.length > 0;

      /** 判断当前行是否显示合计值 */
      const isShowingTotal = showTotalValueCodes.has(code || '');

      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonMissionAccounting/show', {
              label: '查看',
              key: '查看',
              onClick: () => handleActionClick(VIEW, record),
            }),
            !isNotSelf &&
              hasChildren &&
              checkAuth('/carbonMissionAccounting/show', {
                label: isShowingTotal ? '展示自身值' : '展示合计值',
                key: isShowingTotal ? '展示自身值' : '展示合计值',
                onClick: () => {
                  if (code) {
                    toggleRowDisplayMode(code);
                  }
                },
              }),
          ])}
        />
      );
    },
  },
];
