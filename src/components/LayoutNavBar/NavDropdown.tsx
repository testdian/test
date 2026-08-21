import { Dropdown } from 'antd';
import { DropDownProps } from 'antd/es/dropdown';
import React, { memo } from 'react';

interface NavDropDownProps extends DropDownProps {
  children: React.ReactNode;
}

function NavDropDown(props: NavDropDownProps) {
  return <Dropdown {...props}>{props.children}</Dropdown>;
}

export default memo(NavDropDown);
