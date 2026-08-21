import { Checkbox, Form, Input, InputNumber } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { FormLabelWithNote } from '@/components/ModifyNote';
import type { ReductionCategory } from '@/views/supplyChainCarbon/data/demo-supply-chain';
import styles from '@/views/supplyChainCarbon/styles.module.less';

import {
  MAX_FUNCTIONAL_UNIT_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
  PRODUCT_NAME_NOTE,
  syncOrgCarbonTargets,
  syncProductCarbonTarget,
  type ReductionTargetFormValues,
} from './reduction-target-form';

export const REDUCTION_CATEGORY_OPTIONS = [
  { label: '组织碳', value: 'org' as const },
  { label: '产品碳', value: 'product' as const },
];

export function syncComputedTargets(
  form: FormInstance<ReductionTargetFormValues>,
) {
  const values = form.getFieldsValue();
  const next: Partial<ReductionTargetFormValues> = {};
  if (values.categories?.includes('org')) {
    next.org_carbon = syncOrgCarbonTargets(values.org_carbon);
  }
  if (values.categories?.includes('product')) {
    next.product_carbon = syncProductCarbonTarget(values.product_carbon);
  }
  form.setFieldsValue(next);
}

export function OrgCarbonFields({
  form,
}: {
  form: FormInstance<ReductionTargetFormValues>;
}) {
  const touchTargets = () => syncComputedTargets(form);

  return (
    <div className={styles.reductionTargetBlock}>
      <div className={styles.reductionTargetBlockTitle}>组织碳</div>
      <div className={styles.reductionTargetScopeTitle}>范围一</div>
      <Form.Item
        name={['org_carbon', 'scope1_prev_emission']}
        label='上一年度排放量（tCO₂e）'
        rules={[{ required: true, message: '请输入范围一上一年度排放量' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={2}
          placeholder='请输入'
          onChange={touchTargets}
        />
      </Form.Item>
      <Form.Item
        name={['org_carbon', 'scope1_reduction_ratio']}
        label='减排比例（%）'
        rules={[{ required: true, message: '请输入范围一减排比例' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          precision={1}
          placeholder='请输入'
          onChange={touchTargets}
        />
      </Form.Item>
      <Form.Item
        name={['org_carbon', 'scope1_target_emission']}
        label='目标排放量（tCO₂e）'
      >
        <InputNumber style={{ width: '100%' }} disabled precision={2} />
      </Form.Item>

      <div className={styles.reductionTargetScopeTitle}>范围二</div>
      <Form.Item
        name={['org_carbon', 'scope2_prev_emission']}
        label='上一年度排放量（tCO₂e）'
        rules={[{ required: true, message: '请输入范围二上一年度排放量' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={2}
          placeholder='请输入'
          onChange={touchTargets}
        />
      </Form.Item>
      <Form.Item
        name={['org_carbon', 'scope2_reduction_ratio']}
        label='减排比例（%）'
        rules={[{ required: true, message: '请输入范围二减排比例' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          precision={1}
          placeholder='请输入'
          onChange={touchTargets}
        />
      </Form.Item>
      <Form.Item
        name={['org_carbon', 'scope2_target_emission']}
        label='目标排放量（tCO₂e）'
      >
        <InputNumber style={{ width: '100%' }} disabled precision={2} />
      </Form.Item>
    </div>
  );
}

export function ProductCarbonFields({
  form,
  readOnly = false,
}: {
  form: FormInstance<ReductionTargetFormValues>;
  readOnly?: boolean;
}) {
  const touchTarget = () => syncComputedTargets(form);

  return (
    <div className={styles.reductionTargetBlock}>
      <div className={styles.reductionTargetBlockTitle}>产品碳</div>
      <Form.Item
        name={['product_carbon', 'product_name']}
        label={
          <FormLabelWithNote label='产品名称' note={PRODUCT_NAME_NOTE} />
        }
        rules={[
          { required: true, message: '请输入产品名称' },
          {
            max: MAX_PRODUCT_NAME_LENGTH,
            message: `产品名称不超过${MAX_PRODUCT_NAME_LENGTH}个字符`,
          },
        ]}
      >
        <Input
          placeholder='请输入产品名称'
          maxLength={MAX_PRODUCT_NAME_LENGTH}
          showCount={!readOnly}
          readOnly={readOnly}
        />
      </Form.Item>
      <Form.Item
        name={['product_carbon', 'prev_footprint']}
        label='上一年度产品碳足迹（tCO₂e/功能单位）'
        rules={[{ required: true, message: '请输入上一年度产品碳足迹' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={2}
          placeholder='请输入'
          onChange={touchTarget}
        />
      </Form.Item>
      <Form.Item
        name={['product_carbon', 'functional_unit']}
        label='功能单位'
        rules={[
          { required: true, message: '请输入功能单位' },
          {
            max: MAX_FUNCTIONAL_UNIT_LENGTH,
            message: `功能单位不超过${MAX_FUNCTIONAL_UNIT_LENGTH}个字符`,
          },
        ]}
      >
        <Input
          placeholder='请输入功能单位'
          maxLength={MAX_FUNCTIONAL_UNIT_LENGTH}
          showCount={!readOnly}
          readOnly={readOnly}
        />
      </Form.Item>
      <Form.Item
        name={['product_carbon', 'reduction_ratio']}
        label='减排比例（%）'
        rules={[{ required: true, message: '请输入减排比例' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          precision={1}
          placeholder='请输入'
          onChange={touchTarget}
        />
      </Form.Item>
      <Form.Item
        name={['product_carbon', 'target_footprint']}
        label='目标产品碳足迹（tCO₂e/功能单位）'
      >
        <InputNumber style={{ width: '100%' }} disabled precision={2} />
      </Form.Item>
    </div>
  );
}

export type { ReductionCategory };
