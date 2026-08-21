/**
 * @description 供应商 - 编辑减排计划
 */
import { Form, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  canSupplierEditPlan,
  enrichPlan,
  updateReductionPlan,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { PLAN_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';

import {
  formValuesToPlanPayload,
  planToFormValues,
  SUPPLIER_PLAN_FORM_NOTE,
  type SupplierPlanFormValues,
} from '../plan-form';
import { SupplierPlanFormFields } from '../SupplierPlanFormFields';

export default function SupplierPlanCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editPlanId = (location.state as { planId?: number } | null)?.planId;
  const { supplierId } = useUserRole();
  const { data, update, ready } = useDemoStore();
  const [form] = Form.useForm<SupplierPlanFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const editingPlan = useMemo(() => {
    if (!editPlanId) return null;
    const raw = data.reductionPlans.find(
      plan => plan.id === editPlanId && plan.supplier_id === supplierId,
    );
    return raw ? enrichPlan(data, raw) : null;
  }, [data, editPlanId, supplierId]);

  useEffect(() => {
    if (!ready) return;
    if (!editPlanId || !editingPlan) {
      navigate(SupplyChainSupplierRouteMaps.plans, { replace: true });
    }
  }, [ready, editPlanId, editingPlan, navigate]);

  useEffect(() => {
    if (!editingPlan) return;
    form.setFieldsValue(planToFormValues(editingPlan));
  }, [editingPlan, form]);

  const handleSubmit = async () => {
    if (!editingPlan || !canSupplierEditPlan(editingPlan.status)) return;
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const payload = formValuesToPlanPayload(values);
      update(d =>
        updateReductionPlan(d, editingPlan.id, {
          ...payload,
          status: 'pending',
          submitted_at: today,
        }),
      );
      message.success('计划已提交审核');
      navigate(SupplyChainSupplierRouteMaps.plans);
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready || !editingPlan || !canSupplierEditPlan(editingPlan.status)) {
    return null;
  }

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          编辑减排计划
          <ModifyNote content={SUPPLIER_PLAN_FORM_NOTE} />
        </span>
      }
      wrapperClass='marginBottomFormActionsHeight'
    >
      <div className={`${styles.detailHeader} ${styles.detailHeaderStart}`}>
        <StatusTag status={editingPlan.status} map={PLAN_STATUS_BADGES} />
      </div>

      <div className={styles.formPage}>
        <Form form={form} layout='vertical'>
          <SupplierPlanFormFields
            form={form}
            targetValue={editingPlan.reduction_targets?.target_value || '-'}
            targetYear={editingPlan.reduction_targets?.baseline_year}
            reductionMonth={editingPlan.reduction_month}
          />
        </Form>
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '取消',
            onClick: async () => navigate(SupplyChainSupplierRouteMaps.plans),
          },
          {
            title: '提交审核',
            type: 'primary',
            loading: submitting,
            onClick: async () => handleSubmit(),
          },
        ]}
      />
    </Page>
  );
}
