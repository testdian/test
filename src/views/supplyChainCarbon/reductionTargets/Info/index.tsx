/**
 * @description 减排目标详情/新增/编辑
 */
import { Checkbox, Form, Input, Modal, message, Select, Button } from 'antd';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { FormLabelWithNote, ModifyNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { PageTypeInfo } from '@/router/utils/enums';
import { routeTypeNameRender } from '@/router/utils/index';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import { StatusTag } from '@/views/supplyChainCarbon/components/StatusTag';
import { supplierName } from '@/views/supplyChainCarbon/data/demo-data';
import type { ReductionCategory } from '@/views/supplyChainCarbon/data/demo-supply-chain';
import {
  addReductionTarget,
  canEditReductionTarget,
  canPushReductionTarget,
  enrichTarget,
  pushReductionTarget,
  updateReductionTarget,
} from '@/views/supplyChainCarbon/data/demo-supply-chain';
import { TARGET_STATUS_BADGES } from '@/views/supplyChainCarbon/data/status-badges';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';

import {
  OrgCarbonFields,
  ProductCarbonFields,
  REDUCTION_CATEGORY_OPTIONS,
  syncComputedTargets,
} from '../ReductionTargetFormFields';
import {
  buildPushTargetConfirmContent,
  buildTargetYearOptions,
  formValuesToPayload,
  MAX_SUGGESTIONS_LENGTH,
  REDUCTION_CATEGORY_NOTE,
  REDUCTION_TARGET_FORM_NOTE,
  SUGGESTIONS_NOTE,
  SUPPLIER_NAME_NOTE,
  TARGET_YEAR_NOTE,
  targetToFormValues,
  type ReductionTargetFormValues,
} from '../reduction-target-form';

const TARGET_STATUS_NOTE =
  '状态与操作栏对应关系：待推送—查看、编辑、推送；待确认—查看；已确认—查看；已修改—查看。待推送为管理员已完成减排目标的录入但尚未推送；待确认为已推送给供应商待确认；已确认为供应商已确认接受；已修改为供应商已修改并返回给管理员，默认管理员直接接受该目标。';

export default function ReductionTargetInfoPage() {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();
  const [form] = Form.useForm<ReductionTargetFormValues>();
  const { data, update, ready } = useDemoStore();
  const categories = Form.useWatch('categories', form) || [];

  const isAdd = pageTypeInfo === PageTypeInfo.add;
  const isEdit = pageTypeInfo === PageTypeInfo.edit;
  const isShow = pageTypeInfo === PageTypeInfo.show;
  const targetId = Number(id);

  const target = useMemo(() => {
    if (isAdd) return null;
    const raw = data.reductionTargets.find(item => item.id === targetId);
    return raw ? enrichTarget(data, raw) : null;
  }, [data, isAdd, targetId]);

  const supplierOptions = useMemo(
    () =>
      data.demoSuppliers.map(s => ({
        label: `${s.name}（${s.srm_code || '-'}）`,
        value: s.id,
      })),
    [data.demoSuppliers],
  );

  const targetYearOptions = useMemo(() => {
    const options = buildTargetYearOptions();
    const year = target?.baseline_year;
    if (year && !options.some(option => option.value === year)) {
      return [{ label: String(year), value: year }, ...options];
    }
    return options;
  }, [target?.baseline_year]);

  useEffect(() => {
    if (!target || isAdd) return;
    form.setFieldsValue(targetToFormValues(target));
    syncComputedTargets(form);
  }, [target, isAdd, form]);

  const title = isAdd ? (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      新增减排目标
      <ModifyNote content={REDUCTION_TARGET_FORM_NOTE} />
    </span>
  ) : (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {routeTypeNameRender('减排目标')}
      <ModifyNote content={REDUCTION_TARGET_FORM_NOTE} />
    </span>
  );

  const handleSave = async (pushAfterSave = false) => {
    const values = await form.validateFields();
    if (!values.categories?.length) {
      message.error('请至少选择一种减排类别');
      return;
    }
    syncComputedTargets(form);
    const synced = form.getFieldsValue();
    const payload = formValuesToPayload(synced);

    const persist = () => {
      if (isAdd) {
        update(d =>
          addReductionTarget(d, {
            ...payload,
            status: pushAfterSave ? 'pushed' : 'draft',
          }),
        );
        message.success(pushAfterSave ? '目标已推送至供应商' : '目标已保存');
      } else if (target) {
        update(d => {
          const next = updateReductionTarget(d, target.id, {
            ...payload,
            status: target.status,
          });
          return pushAfterSave ? pushReductionTarget(next, target.id) : next;
        });
        message.success(pushAfterSave ? '目标已推送至供应商' : '保存成功');
      }
      navigate(SupplyChainRefRouteMaps.targetMgmt);
    };

    if (pushAfterSave) {
      Modal.confirm({
        title: '推送确认',
        content: buildPushTargetConfirmContent(
          supplierName(data, values.supplier_id),
        ),
        onOk: persist,
      });
      return;
    }

    persist();
  };

  const handlePushFromView = () => {
    if (!target) return;
    Modal.confirm({
      title: '推送确认',
      content: buildPushTargetConfirmContent(
        target.suppliers?.name || supplierName(data, target.supplier_id),
      ),
      onOk: () => {
        update(d => pushReductionTarget(d, target.id));
        message.success('目标已推送');
        navigate(SupplyChainRefRouteMaps.targetMgmt);
      },
    });
  };

  if (!ready) return null;
  if (!isAdd && !target) {
    return <Page title='减排目标'>未找到该目标</Page>;
  }
  if (isEdit && target && !canEditReductionTarget(target.status)) {
    return (
      <Page title='减排目标'>
        当前状态不可编辑，
        <Button
          type='link'
          onClick={() =>
            navigate(
              SupplyChainRefRouteMaps.targetInfo
                .replace(':pageTypeInfo', PageTypeInfo.show)
                .replace(':id', String(target.id)),
            )
          }
        >
          查看详情
        </Button>
      </Page>
    );
  }

  return (
    <Page
      title={title}
      wrapperClass='marginBottomFormActionsHeight'
    >
      <div
        className={`${styles.formPage} ${isShow ? styles.formReadOnly : ''}`}
      >
        <Form
          form={form}
          layout='vertical'
          disabled={isShow}
          initialValues={{ categories: [] }}
          onValuesChange={changed => {
            if (isShow) return;
            if ('org_carbon' in changed || 'product_carbon' in changed) {
              syncComputedTargets(form);
            }
          }}
        >
          {isShow && target && (
            <Form.Item
              label={
                <FormLabelWithNote label='状态' note={TARGET_STATUS_NOTE} />
              }
            >
              <StatusTag status={target.status} map={TARGET_STATUS_BADGES} />
            </Form.Item>
          )}

          <Form.Item
            name='supplier_id'
            label={
              <FormLabelWithNote label='供应商名称' note={SUPPLIER_NAME_NOTE} />
            }
            rules={[{ required: true, message: '请选择供应商名称' }]}
          >
            <Select
              showSearch
              placeholder='请选择供应商'
              optionFilterProp='label'
              options={supplierOptions}
              disabled={
                isShow ||
                (isEdit && !canEditReductionTarget(target?.status ?? 'draft'))
              }
            />
          </Form.Item>

          <Form.Item
            name='target_year'
            label={
              <FormLabelWithNote label='目标年度' note={TARGET_YEAR_NOTE} />
            }
            rules={[{ required: true, message: '请选择目标年度' }]}
          >
            <Select
              placeholder='请选择目标年度'
              options={targetYearOptions}
            />
          </Form.Item>

          <Form.Item
            name='categories'
            label={
              <FormLabelWithNote label='减排类别' note={REDUCTION_CATEGORY_NOTE} />
            }
            required
            rules={[
              {
                validator: (_, value?: ReductionCategory[]) =>
                  value?.length
                    ? Promise.resolve()
                    : Promise.reject(new Error('请至少选择一种减排类别')),
              },
            ]}
          >
            <Checkbox.Group options={REDUCTION_CATEGORY_OPTIONS} />
          </Form.Item>

          {categories.includes('org') && <OrgCarbonFields form={form} />}
          {categories.includes('product') && (
            <ProductCarbonFields form={form} readOnly={isShow} />
          )}

          <Form.Item
            name='suggestions'
            label={
              <FormLabelWithNote label='低碳改善建议' note={SUGGESTIONS_NOTE} />
            }
            rules={[
              { required: true, message: '请输入低碳改善建议' },
              {
                max: MAX_SUGGESTIONS_LENGTH,
                message: `低碳改善建议不超过${MAX_SUGGESTIONS_LENGTH}个字符`,
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              maxLength={MAX_SUGGESTIONS_LENGTH}
              showCount={!isShow}
              placeholder='请输入低碳改善建议'
            />
          </Form.Item>
        </Form>

        <FormActions
          place='center'
          buttons={
            isShow && target
              ? [
                  {
                    title: '返回',
                    onClick: async () =>
                      navigate(SupplyChainRefRouteMaps.targetMgmt),
                  },
                  ...(canEditReductionTarget(target.status)
                    ? [
                        {
                          title: '编辑',
                          onClick: async () =>
                            navigate(
                              SupplyChainRefRouteMaps.targetInfo
                                .replace(':pageTypeInfo', PageTypeInfo.edit)
                                .replace(':id', String(target.id)),
                            ),
                        },
                      ]
                    : []),
                  ...(canPushReductionTarget(target.status)
                    ? [
                        {
                          title: '推送至供应商',
                          type: 'primary' as const,
                          onClick: async () => handlePushFromView(),
                        },
                      ]
                    : []),
                ]
              : [
                  {
                    title: '返回',
                    onClick: async () =>
                      navigate(SupplyChainRefRouteMaps.targetMgmt),
                  },
                  {
                    title: '保存',
                    onClick: async () => handleSave(false),
                  },
                  {
                    title: '推送至供应商',
                    type: 'primary',
                    onClick: async () => handleSave(true),
                  },
                ]
          }
        />
      </div>
    </Page>
  );
}
