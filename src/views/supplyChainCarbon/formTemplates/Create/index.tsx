/**
 * @description 新增表单模板
 */
import { Form, Input, Select, message } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { FormLabelWithNote } from '@/components/ModifyNote';
import { Page } from '@/components/Page';
import { SupplyChainRefRouteMaps } from '@/router/utils/supplyChainRefEnums';
import type { FormTemplate } from '@/views/supplyChainCarbon/data/demo-data';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import styles from '@/views/supplyChainCarbon/styles.module.less';

const MAX_NAME_LENGTH = 100;

const CATEGORY_NOTE = '供应商类别为下拉选项，支持模糊搜索，从SRM系统中推送';
const NAME_NOTE = '模版名称，文本框，必输，不超过100个字符';

export default function FormTemplateCreatePage() {
  const navigate = useNavigate();
  const { data, update } = useDemoStore();
  const [form] = Form.useForm<{ category: string; name: string }>();

  const srmCategoryOptions = useMemo(
    () =>
      Array.from(new Set(data.demoSuppliers.map(s => s.category))).map(
        category => ({
          label: category,
          value: category,
        }),
      ),
    [data.demoSuppliers],
  );

  const createTemplate = async () => {
    const values = await form.validateFields();
    const category = values.category.trim();
    const name = values.name.trim();

    if (!category || !name) {
      message.error('请填写供应商类别和模板名称');
      return;
    }

    const id = data.nextId.formTemplate ?? data.formTemplates.length + 1;
    const newTemplate: FormTemplate = {
      id,
      category,
      name,
      sections: [],
    };

    update(d => ({
      ...d,
      nextId: { ...d.nextId, formTemplate: id + 1 },
      formTemplates: [...d.formTemplates, newTemplate],
    }));

    message.success('表单模板已创建');
    navigate(
      SupplyChainRefRouteMaps.formTemplateInfo.replace(':id', String(id)),
    );
  };

  return (
    <Page title='新增表单模板' wrapperClass='marginBottomFormActionsHeight'>
      <div className={styles.formPage}>
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            category: srmCategoryOptions[0]?.value,
          }}
        >
          <Form.Item
            name='category'
            label={
              <FormLabelWithNote label='供应商类别' note={CATEGORY_NOTE} />
            }
            rules={[{ required: true, message: '请选择供应商类别' }]}
          >
            <Select
              showSearch
              placeholder='请选择供应商类别'
              optionFilterProp='label'
              options={srmCategoryOptions}
              notFoundContent='暂无可选供应商类别'
            />
          </Form.Item>

          <Form.Item
            name='name'
            label={<FormLabelWithNote label='模板名称' note={NAME_NOTE} />}
            rules={[
              { required: true, message: '请输入模板名称' },
              {
                max: MAX_NAME_LENGTH,
                message: `模板名称不超过${MAX_NAME_LENGTH}个字符`,
              },
            ]}
          >
            <Input
              placeholder='如：正极材料供应商碳数据填报'
              maxLength={MAX_NAME_LENGTH}
              showCount
            />
          </Form.Item>
        </Form>
        <FormActions
          place='center'
          buttons={[
            {
              title: '取消',
              onClick: async () =>
                navigate(SupplyChainRefRouteMaps.formTemplates),
            },
            {
              title: '创建并配置字段',
              type: 'primary',
              onClick: async () => createTemplate(),
            },
          ]}
        />
      </div>
    </Page>
  );
}
