import { Col, Popover, Row } from 'antd';

import I18N from '@/lang/I18N';

const ScopeThreeModal: React.FC<{
  scopeValue: number | string[];
  categoryData: { name: string; code: number }[];
}> = ({ scopeValue, categoryData }) => {
  /** 类别 */
  const content = (
    <Row gutter={16} style={{ width: '600px' }}>
      {categoryData?.map((item, index) => {
        // 显式判断是否是数组类型
        const value = Array.isArray(scopeValue) && scopeValue[index];
        return (
          <Col span={8}>
            <div className='baseText12Color666'>
              {I18N.eca.category}
              {index + 1}：{item.name}
            </div>
            <div className='baseText12ColorBlack baseTextFontWeightBold'>
              {value || '-'}
            </div>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <Popover content={content}>
      <div>
        {I18N.eca.include}15{I18N.eca.categories}
      </div>
    </Popover>
  );
};
export default ScopeThreeModal;
