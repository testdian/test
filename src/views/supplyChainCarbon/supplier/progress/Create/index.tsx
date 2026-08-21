/**
 * @description 供应商 - 新建进度上报
 */
import { DatePicker, Form, Input, Select, message } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import {
  addProgressReport,
  listPlans,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import styles from '@/views/supplyChainCarbon/styles.module.less';

type ProgressFormValues = {
  plan_id: number;
  report_date: dayjs.Dayjs;
  completion_status: string;
  current_reduction?: string;
};

export default function SupplierProgressCreatePage() {
  const navigate = useNavigate();
  const { supplierId } = useUserRole();
  const { data, update, ready } = useDemoStore();
  const [form] = Form.useForm<ProgressFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const plans = useMemo(
    () =>
      supplierId > 0
        ? listPlans(data, { supplier_id: supplierId, status: 'approved' })
        : [],
    [data, supplierId],
  );

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      update(d =>
        addProgressReport(d, {
          plan_id: values.plan_id,
          supplier_id: supplierId,
          report_date: values.report_date.format('YYYY-MM-DD'),
          completion_status: values.completion_status.trim(),
          current_reduction: values.current_reduction?.trim(),
          proof_files: null,
        }),
      );
      message.success('进度已上报');
      navigate(SupplyChainSupplierRouteMaps.progress);
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) return null;

  return (
    <Page title='新建进度上报' wrapperClass='marginBottomFormActionsHeight'>
      <div className={styles.formPage}>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='plan_id'
            label='关联计划'
            rules={[{ required: true, message: '请选择关联计划' }]}
          >
            <Select
              placeholder='请选择已通过审核的减排计划'
              options={plans.map(p => ({
                label: p.plan_name,
                value: p.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name='report_date'
            label='上报日期'
            rules={[{ required: true, message: '请选择上报日期' }]}
          >
            <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
          </Form.Item>
          <Form.Item
            name='completion_status'
            label='完成情况'
            rules={[{ required: true, message: '请填写完成情况' }]}
          >
            <Input.TextArea rows={4} placeholder='请描述当前完成情况' />
          </Form.Item>
          <Form.Item name='current_reduction' label='当前减排量'>
            <Input placeholder='例如：85吨' />
          </Form.Item>
        </Form>
      </div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '取消',
            onClick: async () => navigate(SupplyChainSupplierRouteMaps.progress),
          },
          {
            title: '提交上报',
            type: 'primary',
            loading: submitting,
            onClick: async () => handleSubmit(),
          },
        ]}
      />
    </Page>
  );
}
