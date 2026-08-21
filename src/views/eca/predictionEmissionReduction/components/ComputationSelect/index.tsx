/**
 * @file ComputationSelect
 * @description ghg 类别组件
 */
import I18N from '@src/lang/I18N';
import { Select } from 'antd';
import React, { FC, useEffect, useState } from 'react';

import { getComputationEnumsEnumName } from '@/sdks/computation/computationV2ApiDocs';
import { EnumOptionResp, getEnumOption } from '@/views/eca/hooks';

interface ComputationSelectProps {
  /** 单选回调 */
  onChange?: (value: number) => void;
  /** 多选回调，multiple=true 时生效 */
  onMultipleChange?: (value: number[]) => void;
  /** 占位文本 */
  placeholder?: string;
  /** 枚举类型名称，默认 'ScopeType' */
  enumType?: string;
  /** 控件宽度 */
  width?: string | number;
  /** 是否开启多选，默认 false */
  multiple?: boolean;
}

const ComputationSelect: FC<ComputationSelectProps> = ({
  onChange,
  onMultipleChange,
  placeholder = I18N.eca.ghgClassification3,
  enumType = 'ScopeType',
  width = 180,
  multiple = false,
}) => {
  const [options, setOptions] = useState<EnumOptionResp[]>([]);
  const [value, setValue] = useState<number | number[]>();

  const handleChange = (val: number | number[]) => {
    setValue(val);
    if (multiple) {
      onMultipleChange?.(val as number[]);
    } else {
      onChange?.(val as number);
    }
  };

  // 加载枚举数据
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getComputationEnumsEnumName({
        enumName: enumType,
      });
      const processedOptions = getEnumOption(data?.data || []);
      setOptions(processedOptions);

      // 如果没有默认值，设置第一个选项为默认
      if (processedOptions.length > 0) {
        const firstValue = Number(processedOptions[0].value);
        if (multiple) {
          setValue([firstValue]);
          onMultipleChange?.([firstValue]);
        } else {
          setValue(firstValue);
          onChange?.(firstValue);
        }
      }
    };

    fetchData();
  }, [enumType]);

  return (
    <Select
      allowClear={false}
      placeholder={placeholder}
      style={{ width }}
      value={value}
      options={options}
      mode={multiple ? 'multiple' : undefined}
      onChange={handleChange}
    />
  );
};

export default ComputationSelect;
