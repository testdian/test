import { ProColumns } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Switch, Space, Button } from 'antd';

import { Param } from '@/views/eca/Parameter/type';

import { EmissionSourceParam } from '../../type';

/**
 * @description: 选择参数左侧表格列:参数名称、参数ID、参数格式、单位、参数类型、参数描述
 */
export const paramsLeftColumns: ProColumns<Param>[] = [
  {
    title: I18N.eca.parameter,
    dataIndex: 'paramName',
    ellipsis: true,
    fieldProps: {
      placeholder: I18N.eca.parameter,
    },
    formItemProps: {
      label: '',
      style: {
        width: 120,
      },
    },
  },
  {
    title: I18N.eca.parameterId,
    dataIndex: 'paramCode',
    ellipsis: true,
    fieldProps: {
      placeholder: I18N.eca.parameter,
    },
    formItemProps: {
      label: '',
      style: {
        width: 120,
      },
    },
  },
  {
    title: I18N.eca.parameterFormat,
    dataIndex: 'paramType_name',
    hideInSearch: true,
  },
  {
    title: I18N.Factors.unit,
    dataIndex: 'unitType_name',
    hideInSearch: true,
  },
  {
    title: I18N.eca.type,
    dataIndex: 'paramScope_name',
    hideInSearch: true,
  },
  {
    title: I18N.eca.parameterDescription,
    dataIndex: 'remark',
    ellipsis: {
      showTitle: false,
    },
    hideInSearch: true,
  },
];

/**
 * @description: 选择参数右侧表格列:参数名称、参数类型、是否必填、是否在模板中展示、操作
 */
export const paramsRightColumns = (
  /** 是否必填 */
  handleRequiredFlagChange: (
    record: EmissionSourceParam,
    checked: boolean,
  ) => void,
  /** 是否在模板中展示 */
  handleDisplayFlagChange: (
    record: EmissionSourceParam,
    checked: boolean,
  ) => void,
  /** 编辑 */
  handleEdit: (record: Param) => void,
): ProColumns<EmissionSourceParam>[] => [
  {
    title: '',
    dataIndex: 'id',
    width: 30,
  },
  {
    title: I18N.eca.parameter,
    dataIndex: 'paramNameText',
  },
  {
    title: I18N.eca.type,
    dataIndex: 'paramType_name',
  },
  {
    title: I18N.cbam.isItMandatory,
    dataIndex: 'requiredFlag',
    render: (_, record) => {
      const { requiredFlag } = record;
      return (
        <Switch
          checked={!!requiredFlag}
          onChange={checked => handleRequiredFlagChange(record, checked)}
        />
      );
    },
  },
  {
    title: I18N.eca.isItInTheTemplate,
    dataIndex: 'displayFlag',
    render: (_, record) => {
      const { displayFlag } = record;
      return (
        <Switch
          checked={!!displayFlag}
          onChange={checked => handleDisplayFlagChange(record, checked)}
        />
      );
    },
  },
  {
    title: I18N.Factors.operation,
    key: 'action',
    width: 80,
    render: (_, record) => (
      <Space size='middle'>
        <Button type='link' onClick={() => handleEdit(record as Param)}>
          {I18N.Factors.edit}
        </Button>
      </Space>
    ),
  },
];
