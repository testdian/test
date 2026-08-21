// 在组件目录新建 SelectFactorButton/index.tsx
import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib';

const SelectFactorButton = ({
  buttonValue,
  ...rest
}: { buttonValue: string } & ButtonProps) => {
  return (
    <Button type='link' icon={<SearchOutlined />} {...rest}>
      {buttonValue}
    </Button>
  );
};

export default SelectFactorButton;
