import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import React, { useState } from 'react';

interface DropdownProps {
  options: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(options, 'options');

  return (
    <div className='dropdown'>
      <Button className='dropdown-toggle' onClick={() => setIsOpen(!isOpen)}>
        {I18N.carbonData.carbonEmissionAccounting}
      </Button>
      {isOpen && (
        <div>
          {options?.map((item: any) => {
            return item;
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
