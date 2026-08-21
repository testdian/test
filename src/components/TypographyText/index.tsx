import { Typography } from 'antd';
import { FC } from 'react';
import './index.less';
import { TextProps } from 'antd/es/typography/Text';

const { Text } = Typography;
export const EllipsisTextRender: FC<
  {
    value: React.ReactNode;
    emptyText?: React.ReactNode;
    link?: boolean;
    width?: string;
  } & TextProps
> = ({ value, emptyText = '-', link, width, ...props }): React.ReactNode => {
  // 有效值判断（0需要单独处理）
  const isValid = value !== null && value !== undefined && value !== '';
  return isValid ? (
    <Text
      style={{ width: width || '100%' }}
      ellipsis={{ tooltip: value }}
      {...props}
    >
      <div className={link ? 'link' : ''}>{value}</div>
    </Text>
  ) : (
    <span>{emptyText}</span>
  );
};
