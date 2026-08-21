import I18N from '@src/lang/I18N';
import { Button, Popconfirm } from 'antd';
import React from 'react';

import { checkAuth } from '@/layout/utills';
import { CarbonReductionPerms } from '@/router/utils/carbonReductionEnum';

import styles from './index.module.less';
import ScopeThreeModal from '../../ScopeThreeModal';
import { MetricItem } from '../MetricItem';
import { StageTargetValueListResp } from '../type';

export const StageMetricsInfo: React.FC<{
  categoryData: { name: string; code: number }[];
  item: StageTargetValueListResp & { index: number };
  onEdit: (item: StageTargetValueListResp) => void;
  onDelete: (item: StageTargetValueListResp) => void;
}> = ({ item, categoryData, onEdit, onDelete }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.metricsWrapper}>
          <div className={styles.metricsGrid}>
            <div className={styles.stageTitle}>
              {I18N.eca.stage}
              {item.index}
            </div>

            <MetricItem
              label='SBT alignment'
              value={item?.sbtLevel_name}
              className={styles.metricContainer}
            />

            <MetricItem
              label='Target year'
              value={item?.targetYear}
              className={styles.metricContainer}
            />

            <MetricItem
              label='Scope 1'
              value={item?.scope1Ratio}
              className={styles.metricContainer}
            />

            <MetricItem
              label='Scope 2'
              value={item?.scope2Ratio}
              className={styles.metricContainer}
            />

            <MetricItem
              label='Scope 3'
              value={
                <ScopeThreeModal
                  categoryData={categoryData}
                  scopeValue={
                    item?.scope3ClassifyRatios
                      ?.split(',')
                      .map(i => (i === 'null' ? '' : `${i}%`)) || []
                  }
                />
              }
              className={styles.metricContainer}
              valueClassName={styles.scopeValue}
            />
          </div>
        </div>
        {/* 操作按钮 */}
        <div className={styles.actionButtons}>
          {checkAuth(
            CarbonReductionPerms.targetEdit,
            <Button
              type='link'
              onClick={() => {
                onEdit(item);
              }}
            >
              {I18N.Factors.edit}
            </Button>,
          )}
          {checkAuth(
            CarbonReductionPerms.targetDelete,
            <Popconfirm
              title={I18N.eca.confirmToDelete}
              onConfirm={() => {
                onDelete(item);
              }}
            >
              <Button type='link' danger>
                {I18N.Factors.delete}
              </Button>
            </Popconfirm>,
          )}
        </div>
      </div>
    </div>
  );
};
