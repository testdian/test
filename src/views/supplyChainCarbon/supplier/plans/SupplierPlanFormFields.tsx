import { Form, Input, InputNumber, Radio, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { FormLabelWithNote } from '@/components/ModifyNote';
import styles from '@/views/supplyChainCarbon/styles.module.less';

import {
  MAX_PLAN_MEASURES_LENGTH,
  MAX_PLAN_NAME_LENGTH,
  PLAN_REDUCTION_CATEGORY_OPTIONS,
  positiveNumberRule,
  REDUCE_THIS_MONTH_OPTIONS,
  SUPPLIER_PLAN_FORM_NOTE,
  type ReduceThisMonth,
  type SupplierPlanFormValues,
} from './plan-form';

function clearReductionFields(form: FormInstance<SupplierPlanFormValues>) {
  form.setFieldsValue({
    plan_name: undefined,
    measures: undefined,
    scope1_monthly_reduction: 0,
    scope2_monthly_reduction: 0,
  });
}

type SupplierPlanFormFieldsProps = {
  form: FormInstance<SupplierPlanFormValues>;
  targetEmission: string;
  targetYear?: number;
  reductionMonth?: number;
  supplierName?: string;
  readOnly?: boolean;
};

export function SupplierPlanFormFields({
  form,
  targetEmission,
  targetYear,
  reductionMonth,
  supplierName,
  readOnly = false,
}: SupplierPlanFormFieldsProps) {
  const reduceThisMonth = Form.useWatch('reduce_this_month', form);
  const isReducing = reduceThisMonth === 'yes';
  const reductionCategory = Form.useWatch('reduction_category', form);
  const showOrgCarbon = reductionCategory === 'org';
  const showProductCarbon = reductionCategory === 'product';

  return (
    <>
      {supplierName && (
        <Form.Item label='供应商名称'>
          <Input value={supplierName} disabled />
        </Form.Item>
      )}

      <Form.Item label='目标排放量'>
        <Input value={targetEmission} disabled />
      </Form.Item>

      <Form.Item label='目标年度'>
        <Input value={targetYear ?? '-'} disabled />
      </Form.Item>

      <Form.Item label='减排月份'>
        <Input
          value={reductionMonth != null ? `${reductionMonth}月` : '-'}
          disabled
        />
      </Form.Item>

      <Form.Item
        name='reduce_this_month'
        label={
          <FormLabelWithNote
            label='本月是否减排'
            note={SUPPLIER_PLAN_FORM_NOTE}
          />
        }
        rules={[{ required: !readOnly, message: '请选择本月是否减排' }]}
      >
        <Select
          placeholder='请选择'
          options={REDUCE_THIS_MONTH_OPTIONS}
          disabled={readOnly}
          onChange={(value: ReduceThisMonth) => {
            if (value === 'no') {
              clearReductionFields(form);
            }
          }}
        />
      </Form.Item>

      <Form.Item
        name='reduction_category'
        label='减排类别'
        rules={
          readOnly ? undefined : [{ required: true, message: '请选择减排类别' }]
        }
      >
        <Radio.Group options={PLAN_REDUCTION_CATEGORY_OPTIONS} disabled />
      </Form.Item>

      {showOrgCarbon && (
        <>
          <div className={styles.reductionTargetScopeTitle}>范围一</div>
          <Form.Item
            name='scope1_actual_emission'
            label='当月实际排放量（tCO2e）'
            rules={
              readOnly
                ? undefined
                : [
                    { required: true, message: '请输入范围一当月实际排放量' },
                    positiveNumberRule(),
                  ]
            }
          >
            <InputNumber
              min={0}
              precision={4}
              style={{ width: '100%' }}
              placeholder='请输入范围一当月实际排放量'
              disabled={readOnly}
            />
          </Form.Item>
          <Form.Item
            name='scope1_monthly_reduction'
            label='当月减排量（tCO2e）'
            rules={
              readOnly
                ? undefined
                : [{ required: true, message: '请输入范围一当月减排量' }]
            }
          >
            <InputNumber
              min={0}
              precision={4}
              style={{ width: '100%' }}
              placeholder='请输入范围一当月减排量'
              disabled={readOnly}
            />
          </Form.Item>

          <div className={styles.reductionTargetScopeTitle}>范围二</div>
          <Form.Item
            name='scope2_actual_emission'
            label='当月实际排放量（tCO2e）'
            rules={
              readOnly
                ? undefined
                : [
                    { required: true, message: '请输入范围二当月实际排放量' },
                    positiveNumberRule(),
                  ]
            }
          >
            <InputNumber
              min={0}
              precision={4}
              style={{ width: '100%' }}
              placeholder='请输入范围二当月实际排放量'
              disabled={readOnly}
            />
          </Form.Item>
          <Form.Item
            name='scope2_monthly_reduction'
            label='当月减排量（tCO2e）'
            rules={
              readOnly
                ? undefined
                : [{ required: true, message: '请输入范围二当月减排量' }]
            }
          >
            <InputNumber
              min={0}
              precision={4}
              style={{ width: '100%' }}
              placeholder='请输入范围二当月减排量'
              disabled={readOnly}
            />
          </Form.Item>
        </>
      )}

      {showProductCarbon && (
        <Form.Item
          name='actual_product_footprint'
          label='当月实际产品碳足迹（tCO2e/功能单位）'
          rules={
            readOnly
              ? undefined
              : [
                  { required: true, message: '请输入当月实际产品碳足迹' },
                  positiveNumberRule(),
                ]
          }
        >
          <InputNumber
            min={0}
            precision={4}
            style={{ width: '100%' }}
            placeholder='请输入当月实际产品碳足迹'
            disabled={readOnly}
          />
        </Form.Item>
      )}

      {isReducing && (
        <>
          <Form.Item
            name='plan_name'
            label='减排方案名称'
            rules={
              readOnly
                ? undefined
                : [
                    { required: true, message: '请输入减排方案名称' },
                    { max: MAX_PLAN_NAME_LENGTH, message: '不超过100个字符' },
                  ]
            }
          >
            <Input
              maxLength={MAX_PLAN_NAME_LENGTH}
              showCount
              placeholder='请输入减排方案名称'
              disabled={readOnly}
            />
          </Form.Item>

          <Form.Item
            name='measures'
            label='减排措施'
            rules={
              readOnly
                ? undefined
                : [
                    { required: true, message: '请输入减排措施' },
                    {
                      max: MAX_PLAN_MEASURES_LENGTH,
                      message: '不超过1000个字符',
                    },
                  ]
            }
          >
            <Input.TextArea
              rows={5}
              maxLength={MAX_PLAN_MEASURES_LENGTH}
              showCount
              placeholder='请详细描述减排措施'
              disabled={readOnly}
            />
          </Form.Item>
        </>
      )}
    </>
  );
}
