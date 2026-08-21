/**
 * @description 供应商 - 进度上报详情
 */
import { Button } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { enrichProgress } from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate, parseReductionTonnes } from '@/views/supplyChainCarbon/utils';

export default function SupplierProgressInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportId = Number(id);
  const { supplierId } = useUserRole();
  const { data, ready } = useDemoStore();

  const report = useMemo(() => {
    const raw = data.progressReports.find(
      item => item.id === reportId && item.supplier_id === supplierId,
    );
    return raw ? enrichProgress(data, raw) : null;
  }, [data, reportId, supplierId]);

  if (!ready) return null;
  if (!report) {
    return <Page title='进度上报详情'>未找到该上报记录</Page>;
  }

  const expected = parseReductionTonnes(
    report.reduction_plans?.expected_reduction,
  );
  const actual = parseReductionTonnes(report.current_reduction);
  const percent =
    expected > 0 ? Math.min(100, Math.round((actual / expected) * 100)) : 0;

  return (
    <Page title='进度上报详情'>
      <div className={styles.detailGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>计划名称</span>
          <span className={styles.detailValue}>
            {report.reduction_plans?.plan_name || '-'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>上报日期</span>
          <span className={styles.detailValue}>
            {formatDate(report.report_date)}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>当前减排量</span>
          <span className={styles.detailValue}>
            {report.current_reduction || '-'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>完成进度</span>
          <span className={styles.detailValue}>{percent}%</span>
        </div>
        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
          <span className={styles.detailLabel}>完成情况</span>
          <span
            className={styles.detailValue}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {report.completion_status}
          </span>
        </div>
      </div>
      <Button
        style={{ marginTop: 24 }}
        onClick={() => navigate(SupplyChainSupplierRouteMaps.progress)}
      >
        返回列表
      </Button>
    </Page>
  );
}
