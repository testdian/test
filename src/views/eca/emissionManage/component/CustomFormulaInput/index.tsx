/**
 * 自定义公式校验框
 */
import { IFieldProps } from '@formily/core';
import { connect, mapReadPretty } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Input, message } from 'antd';
import { FC, useState } from 'react';

import { Toast } from '@/utils';

import iconAdd from './assets/icon_add.svg';
import iconFx from './assets/icon_fx.svg';
import style from './index.module.less';
import { checkEmissionSourceFormulaApi } from '../../service';

interface ICustomFormulaInputProps extends IFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  emissionSourceTemplateId: string;
  onSuccess?: () => void;
  onAdd?: (value: string) => void;
  disabled?: boolean;
}

const CustomFormulaInputComponent: FC<ICustomFormulaInputProps> = props => {
  const {
    value,
    onChange,
    emissionSourceTemplateId,
    onSuccess,
    onAdd,
    disabled,
  } = props;
  const [loading, setLoading] = useState(false);
  /** 公式校验方法 */
  const validateFormula = async (formula: string) => {
    setLoading(true);
    await checkEmissionSourceFormulaApi({
      formula,
      emissionSourceTemplateId,
    }).finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
    Toast('success', I18N.eca.calculationFormulaCalibration);
    onSuccess?.();
  };

  return (
    <div className={style.formula}>
      <Input.TextArea
        value={value as string}
        onChange={e => onChange?.(e.target.value)}
        rows={4}
        placeholder='请输入'
      />
      <div className={style.formulaBtn}>
        <Button
          className={style.formulaBtnItem}
          loading={loading}
          onClick={() => {
            if (!value) {
              message.error('请先输入公式');
              return;
            }
            validateFormula(value as string);
          }}
        >
          <img src={iconFx} alt='' />
          {I18N.eca.formulaVerification}
        </Button>
        <Button
          className={style.formulaBtnItem}
          disabled={disabled}
          onClick={() => {
            if (!value) {
              message.error('请先输入公式');
              return;
            }
            onAdd?.(value as string);
          }}
        >
          <img src={iconAdd} alt='' />
          添加公式
        </Button>
      </div>
    </div>
  );
};

/** 只读模式下 */
const CustomFormulaReadPretty: FC<Pick<ICustomFormulaInputProps, 'value'>> = ({
  value,
}) => (
  <div className={style.formula}>
    <Input.TextArea value={value as string} rows={4} disabled readOnly />
  </div>
);

// 使用connect连接组件，并使用mapReadPretty指定只读模式下的展示
export const CustomFormulaInput = connect(
  CustomFormulaInputComponent,
  mapReadPretty(CustomFormulaReadPretty),
);
