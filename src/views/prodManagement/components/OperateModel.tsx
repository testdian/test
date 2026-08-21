import {
  Cascader,
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal } from 'antd';
import { useEffect, useMemo } from 'react';

import {
  OperationMetrics,
  OperationMetricsReq,
  postComputationOperationMetricsAdd,
  postComputationOperationMetricsEdit,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import { CurrentModalObj, PageType } from '../type';

/*
 * @@description:
 */
export const OperateModel = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseFn: () => void;
  currentData: OperationMetrics;
  currentModal: PageType;
}) => {
  const { open, setOpen, onCloseFn, currentData, currentModal } = props;
  const form = useMemo(() => {
    return createForm<OperationMetricsReq>({
      readPretty: currentModal === 'SHOW',
    });
  }, [open]);
  // 枚举值分别为 分母单位
  const enums = useAllEnumsBatch(`factorUnitM`);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormLayout,
      Cascader,
      Select,
    },
  });
  useEffect(() => {
    // currentData 编辑使用的缓存数据
    if (currentData?.metricsUnit) {
      form.setValues({
        ...currentData,
        metricsUnit: (currentData.metricsUnit as string)?.split(','),
      });
    }
    form.setFieldState('metricsUnit', {
      dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
    });
  }, [enums, open, currentData]);
  return (
    <Modal
      title={I18N.template(I18N.prodManagement.curre, {
        val1: CurrentModalObj[currentModal],
      })}
      centered
      open={open}
      onOk={() => {
        form.submit(
          async (
            values: OperationMetricsReq & {
              metricsUnit?: string | string[]; // 此处使用联合类型，支持字符串或字符串数组
            },
          ) => {
            const req = {
              ...values,
              metricsUnit:
                typeof values?.metricsUnit === 'object'
                  ? (values?.metricsUnit as string[]).join(',')
                  : values?.metricsUnit,
            };
            // 新增和编辑 区分
            const { data } = currentData.id
              ? await postComputationOperationMetricsEdit({
                  req: {
                    ...req,
                    id: Number(currentData.id),
                  },
                })
              : await postComputationOperationMetricsAdd({
                  req,
                });
            if (data.code === 200) {
              setOpen(false);
              onCloseFn();
              form.reset();
            } else {
              data.msg && Toast('error', data.msg);
            }
          },
        );
      }}
      onCancel={() => {
        setOpen(false);
        form.reset();
        onCloseFn();
      }}
      okText={I18N.base.confirm}
      cancelText={I18N.Factors.cancel}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={{
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  layout: 'vertical',
                },
                properties: {
                  metricsName: {
                    type: 'string',
                    title: I18N.prodManagement.indicatorName,
                    'x-validator': [
                      {
                        required: true,
                        message: I18N.prodManagement.pleaseEnterIndicators,
                      },
                    ],
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      placeholder: I18N.prodManagement.pleaseEnterIndicators,
                      maxLength: 100,
                    },
                  },
                  metricsUnit: {
                    type: 'string',
                    title: I18N.prodManagement.indicatorUnit,
                    'x-validator': [
                      {
                        required: true,
                        message: I18N.prodManagement.pleaseSelectIndicators,
                      },
                    ],
                    'x-component': 'Cascader',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      placeholder: I18N.prodManagement.pleaseSelectIndicators,
                    },
                  },
                },
              },
            },
          }}
        />
      </Form>
    </Modal>
  );
};
