import { Typography } from 'antd';

const { Text } = Typography;
export const noValueBackTextRender = (
  value: React.ReactNode,
  emptyText: React.ReactNode = '-',
): React.ReactNode => {
  // 有效值判断（0需要单独处理）
  const isValid = value !== null && value !== undefined && value !== '';
  return isValid ? (
    <Text style={{ width: '100%' }} ellipsis={{ tooltip: value }}>
      {value}
    </Text>
  ) : (
    <span>{emptyText}</span>
  );
};
