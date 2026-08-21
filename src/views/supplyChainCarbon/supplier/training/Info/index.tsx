/**
 * @description 供应商 - 培训资料详情（只读）
 */
import { Button } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { decodeHTML } from '@/components/formily/FormilyMyEditor/utils';
import { Page } from '@/components/Page';
import { PageTypeInfo } from '@/router/utils/enums';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';

export default function SupplierTrainingInfoPage() {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();
  const trainingId = Number(id);
  const { data, ready } = useDemoStore();

  const training = useMemo(
    () => data.trainings.find(item => item.id === trainingId) ?? null,
    [data.trainings, trainingId],
  );

  if (!ready) return null;
  if (!training || training.status !== 'published') {
    return <Page title='培训资料'>未找到该培训资料</Page>;
  }

  if (pageTypeInfo !== PageTypeInfo.show) {
    navigate(
      SupplyChainSupplierRouteMaps.trainingInfo
        .replace(':pageTypeInfo', PageTypeInfo.show)
        .replace(':id', String(trainingId)),
      { replace: true },
    );
    return null;
  }

  return (
    <Page title={training.title}>
      <div className={styles.detailGrid} style={{ marginBottom: 24 }}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>资料名称</span>
          <span className={styles.detailValue}>{training.title}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>类型</span>
          <span className={styles.detailValue}>{training.type}</span>
        </div>
        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
          <span className={styles.detailLabel}>内容摘要</span>
          <span className={styles.detailValue}>{training.summary || '-'}</span>
        </div>
      </div>

      <div
        className={styles.pageSection}
        dangerouslySetInnerHTML={{
          __html: decodeHTML(training.content),
        }}
      />

      <Button
        style={{ marginTop: 24 }}
        onClick={() => navigate(SupplyChainSupplierRouteMaps.workbench)}
      >
        返回
      </Button>
    </Page>
  );
}
