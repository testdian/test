import { PlusOutlined } from '@ant-design/icons';
import { connect, mapProps, useForm } from '@formily/react';
import I18N from '@src/lang/I18N';
import {
  Select,
  Input,
  Button,
  message,
  Divider,
  Space,
  SelectProps,
} from 'antd';
import React, { FC, useState } from 'react';

import { EMAIL_FLAG } from '../../const';
import { ToConfigType } from '../EmailManageDrawer/config';

const { PERSON } = ToConfigType;

interface UserOption {
  label: string;
  value?: string;
}

interface CustomSelectProps extends SelectProps {
  /** 已选择的用户列表 */
  value?: string[];
  /** 可选的用户列表 */
  options?: UserOption[];
  /** 选择变化回调 */
  onChange?: (value: string[]) => void;
  /** 自定义用户创建回调 */
  onCreateUserOptions?: (options: UserOption[]) => void;
  /** 占位文本 */
  placeholder?: string;
  /** 抄送人/收件人的类型 */
  filedType?: string;
}

const CustomUserSelect: FC<CustomSelectProps> = ({
  value = [],
  options = [],
  onChange,
  onCreateUserOptions,
  placeholder = I18N.dashborad.pleaseSelectAUser,
  filedType,
  ...restProps
}) => {
  const form = useForm();
  /** 收件人类型 */
  const toConfig = form.getFieldState(`${filedType}`).value;
  const [, setSearchValue] = useState('');
  const [newUserName, setNewUserName] = useState('');

  // 处理选择变化
  const handleChange = (selectedValues: string[]) => {
    const selectedOptions = [...selectedValues];
    onChange?.(selectedOptions);
  };

  // 处理搜索框变化
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  // 处理创建新用户
  const handleCreateUser = async () => {
    if (!newUserName) {
      message.warning(I18N.base.pleaseEnterTheUser);
      return;
    }
    onCreateUserOptions?.([
      ...options,
      {
        label: newUserName,
        value: `${Date.now().toString()}${EMAIL_FLAG}${newUserName}`,
      },
    ]);
  };

  // 自定义下拉菜单渲染
  const dropdownRender = (menu: React.ReactNode) => {
    return (
      <div>
        {menu}
        <Divider style={{ margin: '8px 0' }} />
        <Space style={{ padding: '0 8px 4px' }}>
          <Input
            placeholder={I18N.base.userName}
            value={newUserName}
            onChange={e => setNewUserName(e.target.value)}
            onKeyDown={e => {
              e.stopPropagation();
            }}
            style={{ marginBottom: 8 }}
          />
          <Button
            type='text'
            icon={<PlusOutlined />}
            onClick={handleCreateUser}
          >
            {I18N.carbonAccount.add}
          </Button>
        </Space>
      </div>
    );
  };
  return (
    <Select
      value={value}
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      placeholder={placeholder}
      // 仅在类型为用户时使用自定义下拉菜单
      dropdownRender={toConfig === PERSON ? dropdownRender : undefined}
      style={{ width: '100%' }}
      {...restProps}
    />
  );
};

export const FormilyUserSelect = connect(
  CustomUserSelect,
  mapProps({ dataSource: 'options' }, props => {
    return {
      ...props,
    };
  }),
);
