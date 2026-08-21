/**
 * @description 供应商 - 减排目标详情
 */
import { Checkbox, Form, Input, Modal, Select, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { FormLabelWithNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import { supplierName } from '@/views/supplyChainCarbon/data/demo-data';
import {
  confirmReductionTarget,
  enrichTarget,
  generateMonthlyPlansForTarget,
  updateReductionTarget,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { SUPPLIER_TARGET_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import { useUserRole } from '@/views/supplyChainCarbon/hooks/useUserRole';
import {
  OrgCarbonFields,
  ProductCarbonFields,
  REDUCTION_CATEGORY_OPTIONS,
  syncComputedTargets,
} from '@/views/supplyChainCarbon/reductionTargets/ReductionTargetFormFields';
import {
  buildTargetYearOptions,
  formValuesToPayload,
  REDUCTION_CATEGORY_NOTE,
  SUGGESTIONS_NOTE,
  SUPPLIER_NAME_NOTE,
  TARGET_YEAR_NOTE,
  targetToFormValues,
  type ReductionTargetFormValues,
} from '@/views/supplyChainCarbon/reductionTargets/reduction-target-form';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const SUPPLIER_TARGET_STATUS_NOTE =
  '状态与操作栏对应关系：待确认、已确认、已修改—查看，待确认进入查看页面后，底部有确认接收、修改目标两个按钮，点击确认接收，弹窗提示：是否确认接收此减排目标？点击修改目标，页面字段：产品碳或组织碳的卡片内字段变为可编辑状态，其他字段仍不可编辑，编辑时，下方为保存、取消按钮，点击保存，则状态变为已修改，并返回列表页；点击取消，则下方按钮变回确认接收、修改目标。';

const CONFIRM_RECEIVE_NOTE = '是否确认接收此减排目标？';

export default function SupplierTargetInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const targetId = Number(id);
  const { supplierId } = useUserRole();
  const { data, update, ready } = useDemoStore();
  const [form] = Form.useForm<ReductionTargetFormValues>();
  const [isEditingCarbon, setIsEditingCarbon] = useState(false);
  const categories = Form.useWatch('categories', form) || [];

  const target = useMemo(() => {
    const raw = data.reductionTargets.find(
      item => item.id === targetId && item.supplier_id === supplierId,
    );
    return raw ? enrichTarget(data, raw) : null;
  }, [data, targetId, supplierId]);

  const targetYearOptions = useMemo(() => {
    const options = buildTargetYearOptions();
    const year = target?.baseline_year;
    if (year && !options.some(option => option.value === year)) {
      return [{ label: String(year), value: year }, ...options];
    }
    return options;
  }, [target?.baseline_year]);

  useEffect(() => {
    if (!target) return;
    form.setFieldsValue(targetToFormValues(target));
    syncComputedTargets(form);
  }, [target, form]);

  const resetFormFromTarget = () => {
    if (!target) return;
    form.setFieldsValue(targetToFormValues(target));
    syncComputedTargets(form);
  };

  const handleConfirm = () => {
    if (!target) return;
    Modal.confirm({
      title: '确认接收',
      content: CONFIRM_RECEIVE_NOTE,
      onOk: () => {
        update(d => confirmReductionTarget(d, target.id));
        message.success('目标已确认');
        navigate(SupplyChainSupplierRouteMaps.targets);
      },
    });
  };

  const handleSaveModify = async () => {
    if (!target) return;
    await form.validateFields();
    syncComputedTargets(form);
    const synced = form.getFieldsValue();
    const payload = formValuesToPayload(synced);
    update(d => {
      const next = updateReductionTarget(d, target.id, {
        org_carbon: payload.org_carbon,
        product_carbon: payload.product_carbon,
        target_value: payload.target_value,
        status: 'modified',
      });
      return generateMonthlyPlansForTarget(next, target.id);
    });
    message.success('目标已修改');
    navigate(SupplyChainSupplierRouteMaps.targets);
  };

  const handleCancelEdit = () => {
    resetFormFromTarget();
    setIsEditingCarbon(false);
  };

  if (!ready) return null;
  if (!target) {
    return <Page title='减排目标详情'>未找到该减排目标</Page>;
  }

  const isPendingConfirm = target.status === 'pushed';
  const isViewMode = !isEditingCarbon;

  return (
    <Page title='减排目标详情' wrapperClass='marginBottomFormActionsHeight'>
      <div
        className={`${styles.formPage} ${isViewMode ? styles.formReadOnly : ''}`}
      >
        <Form
          form={form}
          layout='vertical'
          disabled={isViewMode}
          initialValues={{ categories: [] }}
          onValuesChange={changed => {
            if (isViewMode) return;
            if ('org_carbon' in changed || 'product_carbon' in changed) {
              syncComputedTargets(form);
            }
          }}
        >
          <Form.Item
            label={
              <FormLabelWithNote label='状态' note={SUPPLIER_TARGET_STATUS_NOTE} />
            }
          >
            <StatusTag status={target.status} map={SUPPLIER_TARGET_STATUS_BADGES} />
          </Form.Item>

          <Form.Item
            name='supplier_id'
            label={
              <FormLabelWithNote label='供应商名称' note={SUPPLIER_NAME_NOTE} />
            }
          >
            <Select
              showSearch
              disabled
              optionFilterProp='label'
              options={[
                {
                  label: `${supplierName(data, target.supplier_id)}（${target.suppliers?.srm_code || '-'}）`,
                  value: target.supplier_id,
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name='target_year'
            label={
              <FormLabelWithNote label='目标年度' note={TARGET_YEAR_NOTE} />
            }
          >
            <Select disabled options={targetYearOptions} />
          </Form.Item>

          <Form.Item
            name='categories'
            label={
              <FormLabelWithNote label='减排类别' note={REDUCTION_CATEGORY_NOTE} />
            }
          >
            <Checkbox.Group disabled options={REDUCTION_CATEGORY_OPTIONS} />
          </Form.Item>

          {categories.includes('org') && <OrgCarbonFields form={form} />}
          {categories.includes('product') && (
            <ProductCarbonFields form={form} readOnly={isViewMode} />
          )}

          <Form.Item
            name='suggestions'
            label={
              <FormLabelWithNote label='低碳改善建议' note={SUGGESTIONS_NOTE} />
            }
          >
            <Input.TextArea rows={4} readOnly />
          </Form.Item>
        </Form>

        <FormActions
          place='center'
          buttons={
            isEditingCarbon
              ? [
                  {
                    title: '取消',
                    onClick: async () => handleCancelEdit(),
                  },
                  {
                    title: '保存',
                    type: 'primary',
                    onClick: async () => handleSaveModify(),
                  },
                ]
              : [
                  {
                    title: '返回',
                    onClick: async () =>
                      navigate(SupplyChainSupplierRouteMaps.targets),
                  },
                  ...(isPendingConfirm
                    ? [
                        {
                          title: '修改目标',
                          onClick: async () => setIsEditingCarbon(true),
                        },
                        {
                          title: '确认接收',
                          type: 'primary' as const,
                          onClick: async () => handleConfirm(),
                        },
                      ]
                    : []),
                ]
          }
        />
      </div>
    </Page>
  );
}
