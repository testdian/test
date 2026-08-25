/**
 * @description 供应商 - 减排计划详情
 */
import { Form } from 'antd';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import {
  enrichPlan,
  formatTargetEmission,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { PLAN_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';

import { SupplierPlanFormFields } from '../SupplierPlanFormFields';
import { planToFormValues, SUPPLIER_PLAN_FORM_NOTE } from '../plan-form';

export default function SupplierPlanInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const planId = Number(id);
  const { supplierId } = useUserRole();
  const { data, ready } = useDemoStore();
  const [form] = Form.useForm();

  const plan = useMemo(() => {
    const raw = data.reductionPlans.find(
      item => item.id === planId && item.supplier_id === supplierId,
    );
    return raw ? enrichPlan(data, raw) : null;
  }, [data, planId, supplierId]);

  useEffect(() => {
    if (!plan) return;
    form.setFieldsValue(planToFormValues(plan));
  }, [plan, form]);

  if (!ready) return null;
  if (!plan) {
    return <Page title='减排计划详情'>未找到该计划</Page>;
  }

  return (
    <Page
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          减排计划详情
          <ModifyNote content={SUPPLIER_PLAN_FORM_NOTE} />
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
            targetEmission={formatTargetEmission(plan.reduction_targets)}
            targetYear={plan.reduction_targets?.baseline_year}
            reductionMonth={plan.reduction_month}
            supplierName={plan.suppliers?.name}
            readOnly
          />
        </Form>
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => navigate(SupplyChainSupplierRouteMaps.plans),
          },
        ]}
      />
    </Page>
  );
}
