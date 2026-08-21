import I18N from '@src/lang/I18N';
import { InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';

import { CbamEnumResp } from '@/views/cbam/hook/type';
import { ConfigCNResp } from '@/views/certificationReviewCenter/cbam/ReportForm/type';

import style from './index.module.less';
import { numberPropsData } from './until';
import { SOURCE_ENUM } from '../../constant';

const { DEFAULT } = SOURCE_ENUM;

/** 带CN选择框的组件 */
export const SelectWithCN: React.FC<{
  cnCode?: string | null;
  value?: number;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  cnOption?: ConfigCNResp[];
  onChangeCnCode?: (cnCode?: string | null) => void;
}> = ({ cnCode, value, onChange, disabled, cnOption = [], onChangeCnCode }) => {
  const [currentCnCode, setCurrentCnCode] = useState(cnCode);
  const [preDisable, setPreDisable] = useState(disabled);
  if (disabled !== preDisable) {
    setPreDisable(disabled);
    /** 切换是否使用默认值计算时重置 */
    onChange?.(null);
    // 更改数据源-重置cnCode
    onChangeCnCode?.(undefined);
    setCurrentCnCode(null);
  }

  return (
    <div className={style.selectWithCNWrapper}>
      {disabled && (
        <Select
          defaultValue={cnCode}
          value={currentCnCode}
          options={cnOption}
          placeholder={I18N.cbam.pleaseSelectPrecursor}
          onSelect={(cn, rowOption) => {
            const { defaultPer } = rowOption || {};
            // 更改输入框的值
            onChange?.(defaultPer);
            // 更改数据源-赋值cnCode
            onChangeCnCode?.(cn);
            setCurrentCnCode(cn);
          }}
        />
      )}
      <InputNumber
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={I18N.base.pleaseEnter}
        {...numberPropsData}
      />
    </div>
  );
};

/** 隐含排放输入框 */
export const ImpliedEmissionInput: React.FC<{
  value?: number;
  onChange?: (value?: number) => void;
  impliedEmission?: number;
}> = ({ value, onChange, impliedEmission }) => {
  useEffect(() => {
    onChange?.(impliedEmission);
  }, [impliedEmission]);

  return (
    <InputNumber
      value={value || impliedEmission}
      disabled
      placeholder={I18N.base.pleaseEnter}
    />
  );
};

/** 使用默认值的原因的下拉框 */
export const DefaultSelect: React.FC<{
  value?: number;
  onChange?: (value?: number | null) => void;
  disabled?: boolean;
  options?: CbamEnumResp[];
}> = ({ value, onChange, disabled, options }) => {
  if (disabled) {
    onChange?.(null);
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={options}
      fieldNames={{
        label: 'name',
        value: 'code',
      }}
      placeholder={I18N.Factors.pleaseSelect}
    />
  );
};

/** 隐含排放（直接）来源下拉框 */
export const EmissionSourceSelect: React.FC<{
  value?: number;
  onChange?: (value?: number) => void;
  disabled?: boolean;
  options?: CbamEnumResp[];
}> = ({ value, onChange, disabled, options }) => {
  if (disabled) {
    onChange?.(DEFAULT);
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={options}
      fieldNames={{
        label: 'name',
        value: 'code',
      }}
      placeholder={I18N.Factors.pleaseSelect}
    />
  );
};
