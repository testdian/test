import { Table } from 'antd';

import {
  fieldTypeLabel,
  type FormField,
  type FormTemplateSection,
} from '../data/demo-data';

type FormFieldPreviewProps = {
  fields?: FormField[];
  sections?: FormTemplateSection[];
};

const fieldColumns = [
  {
    title: '序号',
    width: 60,
    render: (_: unknown, __: FormField, index: number) => index + 1,
  },
  { title: '字段名称', dataIndex: 'name' },
  { title: '字段ID', dataIndex: 'code' },
  {
    title: '类型',
    dataIndex: 'type',
    width: 100,
    render: (v: string) => fieldTypeLabel(v),
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 80,
    render: (v: string) => v || '-',
  },
  {
    title: '必填',
    dataIndex: 'required',
    width: 60,
    render: (v: boolean) => (v ? '是' : '否'),
  },
];

export function FormFieldPreview({ fields = [], sections }: FormFieldPreviewProps) {
  if (sections?.length) {
    const total = sections.reduce(
      (count, section) => count + section.fields.length,
      0,
    );
    if (!total) {
      return (
        <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
          暂未引用表单模板字段
        </div>
      );
    }

    return (
      <div>
        {sections.map(section => (
          <div key={section.id} style={{ marginBottom: 24 }}>
            <div
              style={{
                marginBottom: 12,
                fontSize: 14,
                fontWeight: 500,
                color: '#262626',
              }}
            >
              {section.name}（{section.fields.length}）
            </div>
            {section.fields.length ? (
              <Table
                rowKey='id'
                pagination={false}
                dataSource={section.fields}
                columns={fieldColumns}
              />
            ) : (
              <div style={{ color: 'rgba(0,0,0,0.45)' }}>该分区暂无字段</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!fields.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
        暂未引用表单模板字段
      </div>
    );
  }

  return (
    <Table
      rowKey='id'
      pagination={false}
      dataSource={fields}
      columns={fieldColumns}
    />
  );
}
