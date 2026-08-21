/**
 * @description 核查计划详情 - 列定义
 */
import { ProColumns } from '@ant-design/pro-components';
import { Button, Space } from 'antd';

import { modal } from '@/store/module/notification';
import { returnDelModalStyle, returnNoIconModalStyle, Toast } from '@/utils';

import { deleteVerificationPlanDetailApi } from './service';
import { VerificationPlanDetailItem } from './type';

interface ColumnsOptions {
  onDeleteSuccess: () => void;
  emissionSourceOptions?: { label: string; value: string }[];
  principalOptionsMap?: Record<string, { label: string; value: string }[]>;
  onEmissionSourceChange?: (rowKey: string, selectedIds: string[]) => void;
  isDetail?: boolean;
}

export const generateColumns = ({
  onDeleteSuccess,
  emissionSourceOptions = [],
  principalOptionsMap = {},
  onEmissionSourceChange,
  isDetail = false,
}: ColumnsOptions): ProColumns<VerificationPlanDetailItem>[] => [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 60,
    editable: false,
    fixed: 'left',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    valueType: 'date',
    width: 160,
    fieldProps: {
      style: { width: '100%' },
    },
    render: (_, record) => record.startTime || '-',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    valueType: 'date',
    width: 160,
    fieldProps: {
      style: { width: '100%' },
    },
    render: (_, record) => record.endTime || '-',
  },
  {
    title: '内容',
    dataIndex: 'content',
    valueType: 'textarea',
    fieldProps: {
      autoSize: { minRows: 1, maxRows: 6 },
      maxLength: 500,
      showCount: true,
    },
    render: (_, record) =>
      record.content ? (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {record.content}
        </div>
      ) : (
        '-'
      ),
  },
  {
    title: '排放源名称',
    dataIndex: 'groupIds',
    width: 300,
    valueType: 'select',
    fieldProps: (_form: any, config: any) => ({
      options: emissionSourceOptions,
      mode: 'multiple',
      showSearch: true,
      allowClear: true,
      optionFilterProp: 'label',
      placeholder: '请选择排放源',
      onChange: (selectedIds: string[]) => {
        onEmissionSourceChange?.(String(config.rowKey), selectedIds || []);
      },
    }),
    render: (_, record) => record.groupNames || '-',
  },
  {
    title: '部门',
    dataIndex: 'department',
    width: 160,
    valueType: 'text',
    fieldProps: {
      maxLength: 100,
      placeholder: '请输入部门',
    },
    render: (_, record) => record.department || '-',
  },
  {
    title: '负责人（填报角色）',
    dataIndex: 'userIds',
    width: 250,
    valueType: 'select',
    fieldProps: (_form: any, config: any) => ({
      options: principalOptionsMap[String(config.rowKey)] || [],
      mode: 'multiple',
      showSearch: true,
      allowClear: true,
      optionFilterProp: 'label',
      placeholder: '请选择负责人',
    }),
    render: (_, record) => record.userNames || '-',
  },
  {
    title: '审核组',
    dataIndex: 'auditGroup',
    width: 160,
    valueType: 'text',
    fieldProps: {
      maxLength: 100,
      placeholder: '请输入审核组',
    },
    render: (_, record) => record.auditGroup || '-',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 160,
    fixed: 'right',
    hideInTable: isDetail,
    render: (_, record, _index, action) => (
      <Space>
        <Button
          type='link'
          size='small'
          onClick={() => {
            action?.startEditable?.(record.id!);
          }}
        >
          编辑
        </Button>
        <Button
          type='link'
          size='small'
          danger
          onClick={() => {
            modal.confirm({
              title: '提示',
              content: '确认删除该条数据？',
              ...returnNoIconModalStyle,
              ...returnDelModalStyle,
              onOk: async () => {
                await deleteVerificationPlanDetailApi({ id: record.id! });
                Toast('success', '删除成功');
                onDeleteSuccess();
              },
            });
          }}
        >
          删除
        </Button>
      </Space>
    ),
  },
];
