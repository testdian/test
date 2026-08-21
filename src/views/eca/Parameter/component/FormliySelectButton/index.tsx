/**
 * @description 参数格式选择formily
 */

import { Field } from '@formily/core';
import {
  connect,
  mapProps,
  mapReadPretty,
  observer,
  useField,
} from '@formily/react';
import { Col, Row } from 'antd';
import classNames from 'classnames';

import checkedIcon from './icon-checked.svg';
import style from './index.module.less';

const FormliySelectButton = ({
  value,
  options = [],
  disabled,
  onChange,
}: {
  value: number;
  options: { label: string; value: number; icon: string }[];
  disabled: boolean;
  onChange: (value: number | string) => void;
}) => {
  return (
    <div className={style.normalSelectButtonWrapper}>
      <Row gutter={[12, 8]}>
        {options.map(({ value: optionValue, label, icon }) => (
          <Col key={optionValue} span={6}>
            <div
              className={classNames(style.normalSelectButton, {
                [style.selected]: value === optionValue,
              })}
              onClick={() => {
                if (!disabled) {
                  onChange(optionValue);
                }
              }}
            >
              <img src={icon} alt='' />
              <p className={style.name}>{label}</p>
              {value === optionValue && (
                <div className={style.checkedWrap}>
                  <img className={style.checkedIcon} src={checkedIcon} alt='' />
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const FormliySelectButtonReadPretty = observer(
  ({ value }: { value: string }) => {
    const field = useField<Field>();
    const options = field.dataSource ? field.dataSource : [];
    const selectedItem = options.find(option => option.value === value);
    return (
      <div className={style.normalSelectButtonWrapper}>
        <Row gutter={[12, 0]}>
          <Col span={6}>
            <div className={style.normalSelectButton}>
              <img src={selectedItem?.icon} alt='' />
              <p className={style.name}>{selectedItem?.label}</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  },
);

export default connect(
  FormliySelectButton,
  mapProps({ dataSource: 'options' }, props => {
    return {
      ...props,
    };
  }),
  mapReadPretty(FormliySelectButtonReadPretty),
);
