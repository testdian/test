/**
 * @description 减排方案详情 / 计划审核
 */
import { Input, Modal, message } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  enrichPlan,
  reviewReductionPlan,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { PLAN_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { formatDate } from '@/views/supplyChainCarbon/utils';

function formatReductionMonth(month?: number) {
  return month ? `${month}月` : '-';
}

const PLAN_REVIEW_ACTION_NOTE =
  '点击审核进入页面进行审核通过或驳回操作。';

export default function PlanInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const planId = Number(id);
  const { data, update, ready } = useDemoStore();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const isReview =
    (location.state as { review?: boolean } | null)?.review === true;

  const plan = useMemo(() => {
    const raw = data.reductionPlans.find(item => item.id === planId);
    return raw ? enrichPlan(data, raw) : null;
  }, [data, planId]);

  const handleApprove = () => {
    if (!plan) return;
    Modal.confirm({
      title: '确认通过此减排方案？',
      onOk: () => {
        update(d => reviewReductionPlan(d, plan.id, 'approved'));
        message.success('计划已通过');
        navigate(SupplyChainRefRouteMaps.plans);
      },
    });
  };

  const handleReject = () => {
    if (!plan) return;
    if (!rejectComment.trim()) {
      message.error('请填写驳回意见');
      return;
    }
    update(d =>
      reviewReductionPlan(d, plan.id, 'rejected', rejectComment.trim()),
    );
    message.success('计划已驳回');
    setRejectOpen(false);
    navigate(SupplyChainRefRouteMaps.plans);
  };

  if (!ready) return null;
  if (!plan) {
    return <Page title='减排方案详情'>未找到该方案</Page>;
  }

  const canReview = isReview && plan.status === 'pending';

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {isReview ? '计划审核' : '减排方案详情'}
          {canReview && <ModifyNote content={PLAN_REVIEW_ACTION_NOTE} />}
        </span>
      }
      wrapperClass='marginBottomFormActionsHeight'
    >
      <div className={styles.detailHeader}>
        <span />
        <StatusTag status={plan.status} map={PLAN_STATUS_BADGES} />
      </div>
      <div className={styles.detailGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>供应商名称</span>
          <span className={styles.detailValue}>{plan.suppliers?.name}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>目标值</span>
          <span className={styles.detailValue}>
            {plan.reduction_targets?.target_value || '-'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>目标年度</span>
          <span className={styles.detailValue}>
            {plan.reduction_targets?.baseline_year ?? '-'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>减排方案名称</span>
          <span className={styles.detailValue}>{plan.plan_name}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>减排月份</span>
          <span className={styles.detailValue}>
            {formatReductionMonth(plan.reduction_month)}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>提交时间</span>
          <span className={styles.detailValue}>
            {formatDate(plan.submitted_at)}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>预期减排量</span>
          <span className={styles.detailValue}>
            {plan.expected_reduction || '-'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>负责人</span>
          <span className={styles.detailValue}>
            {plan.responsible_person || '-'}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>审核时间</span>
          <span className={styles.detailValue}>
            {formatDate(plan.reviewed_at)}
          </span>
        </div>
        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
          <span className={styles.detailLabel}>减排措施</span>
          <span
            className={styles.detailValue}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {plan.measures}
          </span>
        </div>
        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
          <span className={styles.detailLabel}>时间节点</span>
          <span className={styles.detailValue}>{plan.time_nodes || '-'}</span>
        </div>
        {plan.status === 'rejected' && (
          <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
            <span className={styles.detailLabel}>审核意见</span>
            <span className={styles.detailValue}>
              {plan.review_comment || '-'}
            </span>
          </div>
        )}
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => navigate(SupplyChainRefRouteMaps.plans),
          },
          ...(canReview
            ? [
                {
                  title: '通过',
                  type: 'primary' as const,
                  onClick: async () => handleApprove(),
                },
                {
                  title: '驳回',
                  onClick: async () => setRejectOpen(true),
                },
              ]
            : []),
        ]}
      />

      <Modal
        title='驳回意见'
        open={rejectOpen}
        onOk={handleReject}
        onCancel={() => setRejectOpen(false)}
      >
        <Input.TextArea
          rows={4}
          value={rejectComment}
          onChange={e => setRejectComment(e.target.value)}
          placeholder='请填写驳回意见'
        />
      </Modal>
    </Page>
  );
}
