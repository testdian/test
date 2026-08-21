import { SettingOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button, Radio } from 'antd';
import { FC } from 'react';

import { checkAuth } from '@/layout/utills';

import styles from './index.module.less';
import { TabKey } from '../../config';
import YearSwitcher from '../YearPicker';

interface HeaderSectionProps {
  /** 当前年份 */
  currentYear: number;
  /** 是否有核算任务 */
  hasAccountingTaskId?: number;
  /** 年份变化回调 */
  onYearChange: (year: number) => void;
  /** 打开核算管理抽屉 */
  onOpenAccountingDrawer: () => void;
  /** 切换tab */
  onTabChange: (value: number) => void;
}

const options = () => [
  /** 调用/computation/computationSourceGroup/page */
  { label: I18N.eca.taskStyle, value: TabKey.Task },
  /** 排放源树 /computation/computationSourceGroup/tree */
  { label: I18N.eca.listStyle, value: TabKey.Tree },
];

export const HeaderSection: FC<HeaderSectionProps> = ({
  currentYear,
  hasAccountingTaskId,
  onYearChange,
  onOpenAccountingDrawer,
  onTabChange,
}) => {
  return (
    <div className={styles.frame}>
      <div className={styles.frame1}>
        <span className={styles.carbonEmissionAccounting}>
          {I18N.dashborad.enterpriseCarbonAccounting}
        </span>
        {/* 任务样式/清单样式按钮组 */}
        <Radio.Group
          className={styles.radioGroup}
          optionType='button'
          options={options()}
          defaultValue={1}
          onChange={e => onTabChange(e.target.value)}
        />
        {/* 年份选择器 */}
        <YearSwitcher
          value={currentYear}
          onYearChange={year => onYearChange(year)}
        />
      </div>
      <div className={styles.operation}>
        {hasAccountingTaskId &&
          checkAuth(
            '/carbonMissionAccounting/edit',
            <Button icon={<SettingOutlined />} onClick={onOpenAccountingDrawer}>
              {I18N.eca.accountingManagement}
            </Button>,
          )}
      </div>
    </div>
  );
};
