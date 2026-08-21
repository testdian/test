import { Button, ButtonProps } from 'antd';
import React, { useState, useEffect } from 'react';

interface LoadingButtonType extends ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLElement>) => Promise<void> | void;
  /**
   * 是否启用键盘事件
   */
  enableKeyDown?: boolean;
}

const LoadingButton: React.FC<LoadingButtonType> = ({
  onClick,
  enableKeyDown = true,
  ...props
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick: React.MouseEventHandler<HTMLElement> = ev => {
    setLoading(true);
    onClick?.(ev)?.finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleClick(event as unknown as React.MouseEvent<HTMLElement>);
      }
    };

    if (enableKeyDown) {
      document.addEventListener('keydown', handler);
    }

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [enableKeyDown]);

  return <Button loading={loading} onClick={handleClick} {...props} />;
};

export default LoadingButton;
