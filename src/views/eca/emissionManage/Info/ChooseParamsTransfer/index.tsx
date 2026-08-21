import { QuestionCircleFilled } from '@ant-design/icons';
import {
  ArrayTable,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Switch,
  NumberPicker,
  Input,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import {
  Transfer,
  Button,
  Modal,
  Space,
  Tag,
  Tooltip,
  Form as AntForm,
} from 'antd';
import React, { useEffect, useState } from 'react';

import {
  renderFormilyTableAction,
  renderFormItemSchema,
  renderFromGridSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { getParameterAllListAPi } from '@/views/eca/Parameter/service';
import { Param } from '@/views/eca/Parameter/type';
import { PARAMETER_TYPE } from '@/views/eca/util/paramsUtil/paramsSchema/constant';

import {
  getEmissionSourceParamValueListApi,
  saveEmissionSourceParamValueListApi,
  saveEmissionSourceTemplateApi,
} from '../../service';
import { EmissionSourceParam } from '../../type';

const SchemaField = createSchemaField({
  components: {
    NumberPicker,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    ArrayTable,
    Switch,
    Input,
    Select,
  },
});

const { GLOBAL_PARAMETER } = PARAMETER_TYPE;

const ChooseParamsTransfer: React.FC<{
  emissionSourceId: number;
  emissionSourceTemplateId: number;
  chooseParamsModalOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({
  emissionSourceId,
  emissionSourceTemplateId,
  chooseParamsModalOpen,
  onClose,
  onSuccess,
}) => {
  const [form] = AntForm.useForm();

  const nodeListForm = createForm();

  /** 左侧参数列表 */
  const [leftSourceParamsArray, setLeftSourceParamsArray] = useState<Param[]>(
    [],
  );
  /** 右侧参数列表 */
  const [rightTargetParamsArray, setRightTargetParamsArray] = useState<
    EmissionSourceParam[]
  >([]);
  const [targetKeys, setTargetKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  /** 获取左侧参数列表数据 */
  const fetchLeftParamsData = async () => {
    setLoading(true);
    try {
      const { data } = await getParameterAllListAPi({
        likeParamName: undefined,
        notGlobal: 1,
      });
      const newLeftData =
        data?.data?.map(item => {
          return {
            ...item,
            key: item?.paramCode,
          };
        }) || [];
      setLeftSourceParamsArray(newLeftData);
    } finally {
      setLoading(false);
    }
  };

  /** 获取右侧已选择的参数数据 */
  const fetchRightAllSelectedData = async () => {
    const { data } = await getEmissionSourceParamValueListApi(
      emissionSourceId,
      emissionSourceTemplateId,
    );
    setRightTargetParamsArray(
      data?.data?.map?.(item => {
        return {
          ...item,
          key: item?.paramCode,
        };
      }) || [],
    );
    setTargetKeys(
      data?.data?.map(item => item?.paramCode as unknown as React.Key),
    );
  };

  useEffect(() => {
    if (!chooseParamsModalOpen) return;
    fetchLeftParamsData();
    fetchRightAllSelectedData();
  }, [chooseParamsModalOpen]);

  // 处理 Transfer 数据转移
  const handleChange = (nextTargetKeys: React.Key[]) => {
    setTargetKeys(nextTargetKeys);
    const newRightData = leftSourceParamsArray.filter(item =>
      nextTargetKeys.includes(item.key),
    );
    setRightTargetParamsArray(preRightData => {
      const newItems = newRightData.map(item => ({
        ...item,
        requiredFlag: 1,
        displayFlag: 1,
      }));
      return [...preRightData, ...newItems];
    });
  };

  /** 监测右侧数据变化进行表单数据赋值 */
  useEffect(() => {
    if (rightTargetParamsArray)
      nodeListForm.setValues({
        nodeList: rightTargetParamsArray,
      });
  }, [rightTargetParamsArray]);

  // 保存逻辑优化
  const handleSave = async () => {
    const values = await nodeListForm.submit<{
      nodeList: Param[];
    }>();
    const mergeDimensionValue: { mergeDimension: string[] } =
      await form?.validateFields();
    const submitValues = {
      paramList: values?.nodeList,
      mergeDimension: mergeDimensionValue?.mergeDimension?.toString(),
      emissionSourceId,
      id: emissionSourceTemplateId,
    };
    saveEmissionSourceParamValueListApi(submitValues).then(async res => {
      if (res?.data?.code === 200) {
        await saveEmissionSourceTemplateApi(submitValues);
        onSuccess();
      }
    });
  };

  return (
    <div>
      <Modal
        width='100%'
        height='100%'
        title={I18N.eca.parameterManagement}
        open={chooseParamsModalOpen}
        onOk={handleSave}
        onCancel={onClose}
        footer={
          <Space>
            <div>
              <AntForm form={form}>
                <AntForm.Item
                  label={
                    <Tooltip title={I18N.eca.inNumericalCalculations2}>
                      {I18N.eca.pleaseChooseToMerge}
                      <QuestionCircleFilled />
                    </Tooltip>
                  }
                  name='mergeDimension'
                  required
                >
                  <Select
                    style={{ width: '200px' }}
                    mode='multiple'
                    options={rightTargetParamsArray.map(item => {
                      return {
                        label: item.paramName,
                        value: item.paramCode,
                      };
                    })}
                  />
                </AntForm.Item>
              </AntForm>
            </div>
            <Button onClick={onClose}>{I18N.Factors.cancel}</Button>
            <Button type='primary' onClick={handleSave}>
              {I18N.Factors.preserve}
            </Button>
          </Space>
        }
      >
        <Space>
          {/* 使用 Transfer 组件 */}
          <Transfer
            dataSource={leftSourceParamsArray}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={item => (
              <Space>
                <span>{item.paramName}</span>
                <span>
                  <Tag bordered={false} color='processing'>
                    {item.paramScope_name}
                  </Tag>
                </span>
                <span>
                  <Tag bordered={false} color='processing'>
                    {item.paramType_name}
                  </Tag>
                </span>
              </Space>
            )}
            showSearch
            filterOption={(input: string, item: Param) => {
              return (
                item?.paramName?.includes(input) ||
                item?.paramType_name?.includes(input) ||
                item?.paramScope_name?.includes(input)
              );
            }}
          >
            {({
              direction,
              //   onItemSelectAll,
              //   selectedKeys,
              // eslint-disable-next-line consistent-return
            }) => {
              if (direction === 'right')
                return (
                  <Form form={nodeListForm} previewTextPlaceholder='-'>
                    <SchemaField
                      schema={renderSchemaWithLayout(
                        {},
                        {
                          grid: {
                            ...renderFromGridSchema(),
                            properties: {
                              nodeList: {
                                type: 'array',
                                title: '',
                                'x-component': 'ArrayTable',
                                'x-decorator': 'FormItem',
                                'x-decorator-props': {
                                  gridSpan: 3,
                                },
                                'x-component-props': {
                                  loading,
                                  pagination: false,
                                  scroll: { x: '100%' },
                                  size: 'small',
                                  rowKey: 'paramCode',
                                  rowSelection: {
                                    type: 'checkbox',
                                    getCheckboxProps: (item: {
                                      paramScope: number;
                                    }) => ({
                                      /** 全局参数不可选择 */
                                      disabled:
                                        item.paramScope === GLOBAL_PARAMETER,
                                    }),
                                  },
                                },
                                // columns
                                items: {
                                  type: 'object',
                                  properties: {
                                    column1: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Column',
                                      'x-component-props': {
                                        title: I18N.eca.parameter,
                                      },
                                      properties: {
                                        paramName: renderFormItemSchema({
                                          'x-component': 'Input',
                                          'x-disabled': true,
                                          'x-component-props': {},
                                        }),
                                      },
                                    },
                                    column2: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Column',
                                      'x-component-props': {
                                        title: I18N.eca.type,
                                      },
                                      properties: {
                                        paramScope_name: renderFormItemSchema({
                                          'x-component': 'NumberPicker',
                                          'x-disabled': true,
                                          'x-component-props': {},
                                        }),
                                      },
                                    },
                                    column3: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Column',
                                      'x-component-props': {
                                        title: I18N.dashborad.sort,
                                      },
                                      properties: {
                                        sort: {
                                          type: 'string',
                                          'x-decorator': 'FormItem',
                                          'x-component': 'Input',
                                        },
                                      },
                                    },
                                    column4: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Column',
                                      'x-component-props': {
                                        title: I18N.cbam.isItMandatory,
                                      },
                                      properties: {
                                        requiredFlag: renderFormItemSchema({
                                          'x-decorator': 'FormItem',
                                          'x-component': 'Switch',
                                        }),
                                      },
                                    },
                                    column5: {
                                      type: 'void',
                                      'x-component': 'ArrayTable.Column',
                                      'x-component-props': {
                                        title: I18N.cbam.isItDisplayed,
                                      },
                                      properties: {
                                        displayFlag: renderFormItemSchema({
                                          'x-decorator': 'FormItem',
                                          'x-component': 'Switch',
                                        }),
                                      },
                                    },
                                    column6: renderFormilyTableAction({
                                      actionBtns: () => [
                                        {
                                          label: I18N.Factors.edit,
                                          key: 'Add',
                                          onClick: async () => {},
                                        },
                                      ],
                                      wrapperProps: {
                                        'x-component-props': {
                                          fixed: 'right',
                                        },
                                      },
                                    }),
                                  },
                                },
                              },
                            },
                          },
                        },
                      )}
                    />
                  </Form>
                );
            }}
          </Transfer>
        </Space>
      </Modal>
    </div>
  );
};

export default ChooseParamsTransfer;
