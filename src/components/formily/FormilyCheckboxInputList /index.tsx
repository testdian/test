/**
 * @description CheckboxInputList 组件 多选框+勾选后可输入文本框
 */
import { Field } from '@formily/core';
import { connect, mapProps, useField } from '@formily/react';
import { Row, Col, Input, Space, Checkbox } from 'antd';
import { useMemo } from 'react';

interface DataSourceItem {
  label: string;
  value: string;
}

interface FormValueItem {
  code: string;
  value: string;
}

interface CheckboxInputListProps {
  value?: FormValueItem[];
  onChange?: (value: FormValueItem[]) => void;
  dataSource?: DataSourceItem[];
}

const CheckboxInputList = ({
  value = [],
  onChange,
  dataSource = [],
}: CheckboxInputListProps) => {
  const field = useField<Field>();

  const readPretty = useMemo(() => {
    return field.readPretty;
  }, [field.readPretty]);

  // 从表单值中提取已选中的 code 列表
  const selectedCodes = useMemo(() => {
    return value.map(item => item.code);
  }, [value]);

  // 从表单值中提取输入框的值，以 code 为 key
  const inputValues = useMemo(() => {
    const map: Record<string, string> = {};
    value.forEach(item => {
      map[item.code] = item.value || '';
    });
    return map;
  }, [value]);

  // 处理复选框变化
  const handleCheckboxChange = (checkedCodes: string[]) => {
    const newValue: FormValueItem[] = checkedCodes.map(code => {
      // 如果之前已经有值，保留输入框的值
      const existingItem = value.find(item => item.code === code);
      return {
        code,
        value: existingItem?.value || '',
      };
    });
    onChange?.(newValue);
  };

  // 处理输入框变化
  const handleInputChange = (code: string, inputValue: string) => {
    const newValue = value.map(item => {
      if (item.code === code) {
        return { ...item, value: inputValue };
      }
      return item;
    });
    onChange?.(newValue);
  };

  return (
    <Checkbox.Group
      style={{ width: '100%' }}
      value={selectedCodes}
      onChange={handleCheckboxChange}
    >
      <Row gutter={[0, 8]}>
        {dataSource.map(item => {
          const isChecked = selectedCodes.includes(item.value);
          return (
            <Col span={24} key={`${item.value}`}>
              <Space style={{ backgroundColor: 'transparent' }}>
                <Checkbox value={item.value} disabled={readPretty}>
                  {item.label}
                </Checkbox>
                {isChecked && (
                  <Input
                    placeholder='请输入'
                    value={inputValues[item.value] || ''}
                    onChange={e =>
                      handleInputChange(item.value, e.target.value)
                    }
                    style={{ width: 200 }}
                    disabled={readPretty}
                  />
                )}
              </Space>
            </Col>
          );
        })}
      </Row>
    </Checkbox.Group>
  );
};

export const FormilyCheckboxInputList = connect(
  CheckboxInputList,
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
