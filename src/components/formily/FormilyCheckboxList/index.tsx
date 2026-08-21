/**
 * @description CheckboxList 组件 多选框
 */
import { Field } from '@formily/core';
import { connect, mapProps, useField } from '@formily/react';
import { Row, Col, Checkbox } from 'antd';
import { useMemo } from 'react';

interface DataSourceItem {
  label: string;
  value: string;
}

interface CheckboxListProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  dataSource?: DataSourceItem[];
}

const CheckboxList = ({
  value = [],
  onChange,
  dataSource = [],
}: CheckboxListProps) => {
  const field = useField<Field>();

  const readPretty = useMemo(() => {
    return field.readPretty;
  }, [field.readPretty]);

  // 处理复选框变化
  const handleCheckboxChange = (checkedValues: string[]) => {
    onChange?.(checkedValues);
  };

  return (
    <Checkbox.Group
      style={{ width: '100%' }}
      value={value}
      onChange={handleCheckboxChange}
    >
      <Row gutter={[0, 8]}>
        {dataSource.map(item => {
          return (
            <Col span={24} key={`${item.value}`}>
              <Checkbox value={item.value} disabled={readPretty}>
                {item.label}
              </Checkbox>
            </Col>
          );
        })}
      </Row>
    </Checkbox.Group>
  );
};

export const FormilyCheckboxList = connect(
  CheckboxList,
  mapProps(
    {
      dataSource: 'dataSource',
    },
    props => {
      return {
        ...props,
        dataSource: props.dataSource || [],
      };
    },
  ),
);
