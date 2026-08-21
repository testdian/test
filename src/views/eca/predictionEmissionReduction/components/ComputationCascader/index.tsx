/**
 * @file ComputationCascader
 * @description ghg 类别组件
 */
import { ProFormCascader } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import React, { FC, useEffect, useState } from 'react';

import { getComputationEnumsEnumName } from '@/sdks/computation/computationV2ApiDocs';
import { EnumOptionResp, getEnumOption } from '@/views/eca/hooks';

interface ComputationCascaderProps {
  /** 父级分类值变化时的回调 */
  onChange?: (value: number[]) => void;
  /** 占位文本 */
  placeholder?: string;
  /** 表单字段名 */
  fieldName?: string;
  /** 枚举类型名称，默认 'ScopeType' */
  enumType?: string;
  /** 列宽配置 */
  colSpan?: number;
  /** 控件宽度 */
  width?: string | number;
  /** 是否显示标签 */
  showLabel?: boolean;
}

const ComputationCascader: FC<ComputationCascaderProps> = ({
  onChange,
  placeholder = I18N.eca.ghgClassification3,
  fieldName = 'ghg',
  enumType = 'ScopeType',
  colSpan = 4,
  width = 230,
  showLabel = false,
}) => {
  const [options, setOptions] = useState<EnumOptionResp[]>([]);
  const [cascaderValue, setCascaderValue] = useState<number[]>([]);

  const handleCascaderChange = (value: number[]) => {
    setCascaderValue(value);
    onChange?.(value);
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
        setCascaderValue([Number(processedOptions?.[0]?.value)]);
        onChange?.([Number(processedOptions?.[0]?.value)]);
      }
    };

    fetchData();
  }, [enumType]);

  return (
    <ProFormCascader
      label={showLabel ? placeholder : false}
      colProps={{ xl: colSpan }}
      name={fieldName}
      fieldProps={{
        allowClear: false,
        placeholder,
        style: {
          width,
        },
        value: cascaderValue,
        options,
        onChange: handleCascaderChange,
      }}
    />
  );
};

export default ComputationCascader;
