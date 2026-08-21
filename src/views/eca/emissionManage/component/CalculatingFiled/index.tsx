import { connect } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Col, Row, Tag } from 'antd';
import { FC } from 'react';

import style from './index.module.less';

type CalculatingFiledProps = {
  // fields: { id: string; paramName: string; paramType: number }[];
  operators: string[];
  // onChange?: (fieldValue: string) => void;
};
/** 计算字段不重复标识 */
export const CalFlag = '_prefix';

const CalculatingFiled: FC<CalculatingFiledProps> = ({
  // fields,
  operators,
  // onChange,
}) => {
  // // 点击字段时调用的函数
  // const handleFieldClick = (fieldValue: string) => {
  //   if (onChange) {
  //     // 调用传入的回调函数，并传递字段值
  //     onChange(fieldValue + uniqueId(CalFlag));
  //   }
  // };
  return (
    <div className={style.calculateBox}>
      <Row gutter={16}>
        {/* <Col span={12}>
          <div className={style.cardBox}>
            <div className={style.filed}>数值字段</div>
            {fields.map(field => {
              if (field.paramType !== 2) return null;
              return (
                <Tag
                  key={field.id}
                  onClick={() => handleFieldClick(field.paramName)}
                >
                  {field.paramName}
                </Tag>
              );
            })}
          </div>
        </Col> */}
        <Col span={24}>
          <div className={style.cardBox}>
            {/* <div className={style.filed}>计算公式说明</div> */}
            <div className={style.cal_des}>
              {I18N.eca.theCalculationFormulaIsDerivedFrom}
            </div>
            {operators.map(opItem => (
              <Tag key={opItem} className={style.tagItem}>
                {opItem}
              </Tag>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(CalculatingFiled);
