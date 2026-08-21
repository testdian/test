/**
 * @description 新增核查计划弹窗
 */
import { Form, FormGrid, FormItem, FormLayout, Select } from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, ISchema } from '@formily/react';
import { Modal } from 'antd';
import { FC, useEffect, useMemo } from 'react';

import { renderFormItemSchema } from '@/components/formily/utils';
import { getComputationComputationOrgListApi } from '@/views/eca/accountingReport/service';

import { AddVerificationPlanReq } from '../../type';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Select,
  },
});

const schema = (): ISchema => ({
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'vertical',
      },
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            rowGap: 2,
            columnGap: 24,
            maxColumns: 1,
            minColumns: 1,
          },
          properties: {
            year: renderFormItemSchema({
              type: 'number',
              title: '核算年度',
              required: true,
              'x-component': 'Select',
              'x-component-props': {
                showSearch: true,
                allowClear: true,
                optionFilterProp: 'label',
              },
            }),
            orgCodes: renderFormItemSchema({
              type: 'array',
              title: '核算组织',
              required: true,
              'x-component': 'Select',
              'x-component-props': {
                showSearch: true,
                allowClear: true,
                optionFilterProp: 'label',
                mode: 'multiple',
              },
              'x-reactions': [`{{ useAsyncOrgDataSource() }}`],
            }),
          },
        },
      },
    },
  },
});

type AddVerificationPlanFormValues = Omit<
  AddVerificationPlanReq,
  'orgCodes'
> & {
  orgCodes: string[];
};

interface AddVerificationPlanModalProps {
  open: boolean;
  confirmLoading?: boolean;
  onCancel: () => void;
  onOk: (values: AddVerificationPlanFormValues) => void;
}

export const AddVerificationPlanModal: FC<AddVerificationPlanModalProps> = ({
  open,
  confirmLoading,
  onCancel,
  onOk,
}) => {
  const yearOptions = useMemo(
    () =>
      Array.from({ length: 2099 - 2019 + 1 }, (_, i) => {
        const year = 2019 + i;
        return { label: year, value: year };
      }),
    [],
  );

  const form = useMemo(
    () =>
      createForm({
        effects: currentForm => {
          let prevOrgValue: string[] = [];

          onFieldValueChange('orgCodes', field => {
            const currentValue = field.value || [];
            const dataSource = field.dataSource || [];

            if (dataSource.length === 0 || currentValue.length === 0) {
              prevOrgValue = currentValue;
              return;
            }

            const firstOptionValue = dataSource[0]?.value;

            if (currentValue.length === 1) {
              prevOrgValue = currentValue;
              return;
            }

            const hasFirstOption = currentValue.includes(firstOptionValue);
            const hadFirstOption = prevOrgValue.includes(firstOptionValue);

            if (hasFirstOption) {
              if (!hadFirstOption) {
                field.setValue([firstOptionValue]);
                prevOrgValue = [firstOptionValue];
              } else {
                const otherValues = currentValue.filter(
                  (val: string) => val !== firstOptionValue,
                );
                field.setValue(otherValues);
                prevOrgValue = otherValues;
              }
            } else {
              prevOrgValue = currentValue;
            }
          });

          onFieldValueChange('year', field => {
            const { selfModified } = field;
            if (selfModified) {
              currentForm.setValuesIn('orgCodes', []);
            }
          });
        },
      }),
    [open],
  );

  const useAsyncOrgDataSource = () => async (field: any) => {
    const currentYear = field?.form?.getValuesIn('year');

    if (!currentYear) {
      field.setDataSource([]);
      field.setValue([]);
      return;
    }

    const { data } = await getComputationComputationOrgListApi({
      year: currentYear,
    });

    const orgList = data?.data?.map(item => ({
      label: item?.orgName,
      value: item?.orgCode,
    }));

    field.setDataSource(orgList);
  };

  useEffect(() => {
    form.setFieldState('year', { dataSource: yearOptions });
  }, [yearOptions, form]);

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  return (
    <Modal
      title='新增核查计划'
      open={open}
      confirmLoading={confirmLoading}
      maskClosable={false}
      width={480}
      okText='确定'
      cancelText='取消'
      onOk={async () => {
        const values = await form.submit<AddVerificationPlanFormValues>();
        onOk(values);
      }}
      onCancel={onCancel}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} scope={{ useAsyncOrgDataSource }} />
      </Form>
    </Modal>
  );
};
