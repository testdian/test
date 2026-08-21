/*
 * @@description: 待审核人列表
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-16 09:44:52
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 16:12:36
 */
import {
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Modal, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';
import {
  AuditUserDto,
  getComputationAuditUserPage,
  postComputationAuditAudit,
  postComputationReportGenerate,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';

import { TextArea } from '../component/TextArea';
import { TextAreaMaxLength500 } from '../util/type';

const columns = [
  {
    title: I18N.dashborad.name,
    dataIndex: 'realName',
  },
  {
    title: I18N.eca.affiliatedCompany,
    dataIndex: 'orgName',
  },
];
export const PendReviewModal = ({
  open,
  handleCancel,
  id,
}: {
  open: boolean;
  handleCancel: () => void;
  id: number;
}) => {
  const [dataSource, getDataSource] = useState<AuditUserDto[]>([]);
  const [pageParams, changePageParams] = useState({
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState(0);
  // user/page
  const getUserPage = async () => {
    await getComputationAuditUserPage({
      ...pageParams,
      id,
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data?.data?.list || [])]);
        setTotal(data?.data?.total || 0);
      }
    });
  };
  useEffect(() => {
    if (id) {
      getUserPage();
    }
  }, [id, pageParams]);

  // 获取待审核人列表
  return (
    <Modal
      centered
      title={I18N.eca.pendingReviewer}
      open={open}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          {I18N.carbonFootPrintLCA.close}
        </Button>,
      ]}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: pageParams.pageSize,
          current: pageParams.pageNum,
          total,
          onChange: (pageNum, pageSize) => {
            changePageParams({
              pageNum,
              pageSize,
            });
          },
          showSizeChanger: false,
        }}
      />
    </Modal>
  );
};
export const ApproveUserList = ({ id }: { id: number }) => {
  const [dataSource, getDataSource] = useState<AuditUserDto[]>([]);
  const [pageParams, changePageParams] = useState({
    pageSize: 10,
    pageNum: 1,
  });
  const [total, setTotal] = useState(0);
  // user/page
  const getUserPage = async () => {
    await getComputationAuditUserPage({
      ...pageParams,
      id,
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data?.data?.list || [])]);
        setTotal(data?.data?.total || 0);
      }
    });
  };
  useEffect(() => {
    if (id) {
      getUserPage();
    }
  }, [id, pageParams]);
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{
        pageSize: pageParams.pageSize,
        current: pageParams.pageNum,
        total,
        onChange: (pageNum, pageSize) => {
          changePageParams({
            pageNum,
            pageSize,
          });
        },
        showSizeChanger: false,
      }}
    />
  );
};

export const AuditModal = ({
  open,
  handleCancel,
  handleOk,
  id,
}: {
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  id: number;
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
  }, [id]);
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
                  // auditDataId: id,
                  computationSourceIdList: [id.toString()],
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

// 生成报告
export const ReportModal = ({
  open,
  handleCancel,
  handleOk,
  id,
}: {
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  id: number;
}) => {
  const navigate = useNavigate();
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      FormLayout,
      Checkbox,
      Input,
      TextArea,
    },
  });
  const form = useMemo(() => {
    return createForm({
      initialValues: {
        reportTypeList: ['1'],
      },
      effects() {},
    });
  }, [id]);
  return (
    <Modal
      centered
      title={I18N.carbonFootPrintLCA.generateReport}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          {I18N.carbonFootPrintLCA.close}
        </Button>,
        <Button
          onClick={async () => {
            form.submit(async value => {
              await postComputationReportGenerate({
                // @ts-ignore
                req: {
                  ...value,
                  reportId: id,
                },
              }).then(({ data }) => {
                if (data.code === 200) {
                  handleOk();
                  modal.confirm({
                    centered: true,
                    title: I18N.carbonFootPrintLCA.generateReport,
                    className: 'modal_del',
                    content: I18N.eca.generateReportTask,
                    onOk: async () => {
                      navigate(RouteMaps.systemDownload);
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
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
                      reportTypeList: {
                        type: 'string',
                        title: I18N.eca.reportVersion,
                        'x-validator': [
                          {
                            required: true,
                            message: I18N.eca.pleaseSelectAReport,
                          },
                        ],
                        'x-decorator': 'FormItem',
                        'x-component': 'Checkbox.Group',
                        enum: [
                          {
                            label: I18N.eca.ghgPr,
                            value: '1',
                          },
                          {
                            label: I18N.eca.isoVersion,
                            value: '2',
                          },
                        ],
                        'x-component-props': {},
                      },
                      // 语言版本
                      languageVersion: {
                        type: 'string',
                        title: I18N.eca.language,
                        'x-validator': [
                          {
                            required: true,
                            message: I18N.eca.pleaseSelectLanguage,
                          },
                        ],
                        'x-decorator': 'FormItem',
                        'x-component': 'Checkbox.Group',
                        enum: [
                          {
                            label: I18N.eca.chineseVersion,
                            value: 1,
                          },
                          {
                            label: I18N.eca.englishVersion,
                            value: 2,
                          },
                        ],
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
