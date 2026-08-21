import { Button } from 'antd';
import React from 'react';

import { checkAuth } from '@/layout/utills';

import style from './index.module.less';

interface MeasuresHeaderProps {
  title: string;
  buttonText?: string;
  buttonShow?: boolean;
  buttonAuth?: string;
  onButtonClick?: () => void;
  /** 标题右侧扩展区（如导出、导入） */
  extra?: React.ReactNode;
  className?: string;
}

const ButtonHeader: React.FC<MeasuresHeaderProps> = ({
  title,
  buttonText,
  buttonShow = true,
  buttonAuth,
  onButtonClick,
  extra,
  className,
}) => {
  const addButton =
    buttonShow && buttonText ? (
      buttonAuth ? (
        checkAuth(
          buttonAuth,
          <Button type='primary' onClick={onButtonClick}>
            {buttonText}
          </Button>,
        )
      ) : (
        <Button type='primary' onClick={onButtonClick}>
          {buttonText}
        </Button>
      )
    ) : null;

  return (
    <div className={[style.buttonTitle, className].filter(Boolean).join(' ')}>
      <div>{title}</div>
      {(extra || addButton) && (
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          {extra}
          {addButton}
        </div>
      )}
    </div>
  );
};

export default ButtonHeader;
