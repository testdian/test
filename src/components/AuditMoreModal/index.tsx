import {
  FormItem,
  FormGrid,
  FormLayout,
  Form,
  Radio,
  Input,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Modal, Button } from 'antd';
import { TextArea } from 'form-render';
import { useMemo } from 'react';

import I18N from '@/lang/I18N';
import { postComputationAuditAudit } from '@/sdks/Newcomputation/computationV2ApiDocs';
import { TextAreaMaxLength500 } from '@/views/eca/util/type';

/** 审核弹窗 */
export const AuditMoreModal = ({
  open,
  handleCancel,
  handleOk,
  formValues,
}: {
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  formValues: {
    auditDataId?: number;
    auditDataIdList?: number[];
    // 用下面这个-2025.12.11
    computationSourceIdList?: number[];
  };
}) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      FormLayout,
      Radio,
      Input,
      TextArea,
    },
  });

  const form = useMemo(() => {
    return createForm({
      initialValues: {},
      effects() {
        onFieldValueChange('auditStatus', () => {
          form.setFieldState('auditComment', {
            value: null,
          });
        });
      },
    });
  }, [formValues?.auditDataId]);

  return (
    <Modal
      centered
      title={I18N.eca.auditing}
      open={open}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          {I18N.Factors.cancel}
        </Button>,
        <Button
          onClick={async () => {
            form.submit(async value => {
              await postComputationAuditAudit({
                req: {
                  ...value,
                  ...formValues,
                },
              }).then(({ data }) => {
                if (data.code === 200) {
                  handleOk();
                }
              });
            });
          }}
          type='primary'
        >
          {I18N.carbonFootPrintLCA.confirm}
        </Button>,
      ]}
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
                  grid: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      rowGap: 2,
                      maxColumns: 1,
                      minColumns: 1,
                    },
                    properties: {
                      auditStatus: {
                        type: 'string',
                        title: I18N.eca.findingsOfAudit,
                        'x-validator': [
                          {
                            required: true,
                            message: I18N.eca.pleaseSelectReview,
                          },
                        ],
                        'x-decorator': 'FormItem',
                        'x-component': 'Radio.Group',
                        enum: [
                          {
                            label: I18N.eca.approved,
                            value: '1',
                          },
                          {
                            label: I18N.eca.reviewFailed,
                            value: '2',
                          },
                        ],
                        'x-component-props': {
                          onChange: (e: { target: { value: string } }) => {
                            // 获取Field组件实例
                            if (e.target.value === '1') {
                              form?.validate('auditComment');
                            }
                          },
                        },
                      },
                      auditComment: {
                        type: 'string',
                        title: I18N.dashborad.remarks,
                        'x-decorator': 'FormItem',
                        'x-component': 'TextArea',
                        'x-component-props': {
                          placeholder: I18N.base.pleaseEnter,
                          maxLength: TextAreaMaxLength500,
                        },
                        'x-reactions': {
                          dependencies: ['auditStatus'],
                          when: `{{$deps[0]==='2'}}`,
                          fulfill: {
                            schema: {
                              'x-validator': [
                                {
                                  required: true,
                                  message: I18N.eca.pleaseEnterANote,
                                },
                              ],
                            },
                          },
                          otherwise: {
                            state: {
                              required: false,
                            },
                          },
                        },
                      },
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
