/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-13 17:49:37
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-21 11:35:30
 */
import { Form, FormGrid, FormItem, FormLayout, Input } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import { getComputationComputationOrgEmissionListId } from '@/sdks/Newcomputation/computationV2ApiDocs';
import { Computation } from '@/sdks/computation/computationV2ApiDocs';
import { Toast } from '@/utils';

const columns = [
  {
    title: I18N.carbonData.organizationName,
    dataIndex: 'orgName',
    render: (orgName: string) => {
      return orgName || '-';
    },
  },
  {
    title: I18N.carbonData.accountingYear,
    dataIndex: 'year',
    render: (year: string) => {
      return year || '-';
    },
  },
  {
    title: I18N.carbonData.emissionsTC,
    dataIndex: 'carbonEmission',
    render: (carbonEmission: string) => {
      return carbonEmission || '-';
    },
  },
];

export const EmissionListModel = ({
  open,
  onOk,
  onCancel,
  catchRecord,
}: {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
  catchRecord: Computation;
}) => {
  const [dataSource, getDataSource] = useState<Computation[]>([]);
  const emissionListFn = async () => {
    await getComputationComputationOrgEmissionListId({
      id: catchRecord?.id || 0,
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data.data || [])]);
      }
    });
  };
  useEffect(() => {
    if (open) {
      emissionListFn();
    }
  }, [open]);
  return (
    <Modal
      centered
      title={I18N.eca.organizationalEmissions}
      open={open}
      maskClosable={false}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      closable
      width={600}
      style={{ background: 'red' }}
      className='emissionListModal'
      okText={I18N.base.confirm}
      cancelText={I18N.Factors.cancel}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ height: '300px' }}
        scroll={{ y: 300 }}
        pagination={false}
      />
    </Modal>
  );
};

export const DelEmissionMOdel = ({
  open,
  onOk,
  onCancel,
  record,
}: {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
  record: Computation;
}) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
    },
  });
  const form = useMemo(() => {
    return createForm({});
  }, [open]);
  return (
    <Modal
      centered
      title={I18N.Factors.prompt}
      open={open}
      maskClosable={false}
      onOk={async () => {
        await form.validate();
        console.log(form?.values.confimValue, 'value-value');
        if (form?.values.confimValue === I18N.prodManagement.confirmDeletion) {
          onOk?.();
        } else {
          Toast('error', I18N.eca.pleaseFillInTheConfirmationForm);
        }
      }}
      onCancel={onCancel}
      width={600}
      okText={I18N.base.confirm}
      cancelText={I18N.Factors.cancel}
    >
      <div>
        <span>
          {I18N.eca.confirmDeletionOfThis4}
          <span className='modal_text'>
            {record?.computationName}，{record.orgName}，{record.year}？
          </span>
        </span>
        <div style={{ marginBottom: '10px' }}>{I18N.eca.ecaModel}</div>
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
                        confimValue: {
                          type: 'string',
                          title: '',
                          'x-validator': [
                            {
                              required: true,
                              message: I18N.eca.pleaseEnterConfirmation,
                            },
                          ],
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: I18N.base.pleaseEnter,
                            maxLength: 100,
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
      </div>
    </Modal>
  );
};
export const DelMoreEmissionMOdel = ({
  open,
  onOk,
  onCancel,
}: {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
}) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
    },
  });
  const form = useMemo(() => {
    return createForm({});
  }, [open]);
  return (
    <Modal
      centered
      title={I18N.Factors.prompt}
      open={open}
      maskClosable={false}
      onOk={async () => {
        await form.validate();
        console.log(form?.values.confimValue, 'value-value');
        if (form?.values.confimValue === I18N.prodManagement.confirmDeletion) {
          onOk?.();
        } else {
          Toast('error', I18N.eca.pleaseFillInTheConfirmationForm);
        }
      }}
      onCancel={onCancel}
      width={600}
      okText={I18N.base.confirm}
      cancelText={I18N.Factors.cancel}
    >
      <div>
        <span>{I18N.eca.confirmDeletion2}</span>
        <div style={{ marginBottom: '10px' }}>{I18N.eca.ecaModel}</div>
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
                        confimValue: {
                          type: 'string',
                          title: '',
                          'x-validator': [
                            {
                              required: true,
                              message: I18N.eca.pleaseEnterConfirmation,
                            },
                          ],
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: I18N.base.pleaseEnter,
                            maxLength: 100,
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
      </div>
    </Modal>
  );
};
// 删除单个排放源
export const DelEmissionSourceModel = ({
  open,
  onOk,
  onCancel,
  record,
}: {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
  record: Computation;
}) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
    },
  });
  const form = useMemo(() => {
    return createForm({});
  }, [open]);
  return (
    <Modal
      centered
      title={I18N.Factors.prompt}
      open={open}
      maskClosable={false}
      onOk={async () => {
        await form.validate();
        if (form?.values.confimValue === I18N.prodManagement.confirmDeletion) {
          onOk?.();
        } else {
          Toast('error', I18N.eca.pleaseFillInTheConfirmationForm);
        }
      }}
      onCancel={onCancel}
      width={600}
      okText={I18N.base.confirm}
      cancelText={I18N.Factors.cancel}
    >
      <div>
        <span>
          {I18N.eca.confirmDeletionOfScheduling}
          <span className='modal_text'>{record?.sourceName}？</span>
        </span>
        <div style={{ marginBottom: '10px' }}>{I18N.eca.ecaModel}</div>
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
                        confimValue: {
                          type: 'string',
                          title: '',
                          'x-validator': [
                            {
                              required: true,
                              message: I18N.eca.pleaseEnterConfirmation,
                            },
                          ],
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: I18N.base.pleaseEnter,
                            maxLength: 100,
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
      </div>
    </Modal>
  );
};
// 批量删除排放源
export const DelMoreEmissionSouuceModel = ({
  open,
  onOk,
  onCancel,
}: {
  open: boolean;
  onOk?: () => void;
  onCancel: () => void;
}) => {
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
    },
  });
  const form = useMemo(() => {
    return createForm({});
  }, [open]);
  return (
    <Modal
      centered
      title={I18N.Factors.prompt}
      open={open}
      maskClosable={false}
      onOk={async () => {
        await form.validate();
        // console.log(form?.values.confimValue, 'value-value');
        if (form?.values.confimValue === I18N.prodManagement.confirmDeletion) {
          onOk?.();
        } else {
          Toast('error', I18N.eca.pleaseFillInTheConfirmationForm);
        }
      }}
      onCancel={onCancel}
      width={600}
      okText={I18N.base.confirm}
      cancelText={I18N.Factors.cancel}
    >
      <div>
        <span>{I18N.eca.confirmDeletion}</span>
        <div style={{ marginBottom: '10px' }}>{I18N.eca.ecaModel}</div>
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
                        confimValue: {
                          type: 'string',
                          title: '',
                          'x-validator': [
                            {
                              required: true,
                              message: I18N.eca.pleaseEnterConfirmation,
                            },
                          ],
                          'x-decorator': 'FormItem',
                          'x-component': 'Input',
                          'x-component-props': {
                            placeholder: I18N.base.pleaseEnter,
                            maxLength: 100,
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
      </div>
    </Modal>
  );
};
