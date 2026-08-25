/**
 * @description 减排方案详情 / 计划审核
 */
import { Form, Input, Modal, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  enrichPlan,
  formatTargetEmission,
  reviewReductionPlan,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { PLAN_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';
import { SupplierPlanFormFields } from '@/views/supplyChainCarbon/supplier/plans/SupplierPlanFormFields';
import {
  planToFormValues,
  SUPPLIER_PLAN_FORM_NOTE,
  type SupplierPlanFormValues,
} from '@/views/supplyChainCarbon/supplier/plans/plan-form';

const PLAN_REVIEW_ACTION_NOTE = `点击审核进入页面进行审核通过或驳回操作。${SUPPLIER_PLAN_FORM_NOTE}`;

export default function PlanInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const planId = Number(id);
  const { data, update, ready } = useDemoStore();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [form] = Form.useForm<SupplierPlanFormValues>();

  const isReview =
    (location.state as { review?: boolean } | null)?.review === true;

  const plan = useMemo(() => {
    const raw = data.reductionPlans.find(item => item.id === planId);
    return raw ? enrichPlan(data, raw) : null;
  }, [data, planId]);

  useEffect(() => {
    if (!plan) return;
    form.setFieldsValue(planToFormValues(plan));
  }, [form, plan]);

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
      <div className={`${styles.detailHeader} ${styles.detailHeaderStart}`}>
        <StatusTag status={plan.status} map={PLAN_STATUS_BADGES} />
      </div>
      <div className={`${styles.formPage} ${styles.formReadOnly}`}>
        <Form
          form={form}
          layout='vertical'
          disabled
          initialValues={planToFormValues(plan)}
        >
          <SupplierPlanFormFields
            form={form}
            supplierName={plan.suppliers?.name}
            targetEmission={formatTargetEmission(plan.reduction_targets)}
            targetYear={plan.reduction_targets?.baseline_year}
            reductionMonth={plan.reduction_month}
            readOnly
          />
          {plan.status === 'rejected' && (
            <Form.Item label='审核意见'>
              <Input.TextArea
                value={plan.review_comment || '-'}
                rows={3}
                disabled
              />
            </Form.Item>
          )}
        </Form>
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
