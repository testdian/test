import { Field } from '@formily/core';
import { connect, useField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { useEffect, useState } from 'react';

export type ButtonProps = {
  onClick?: (ev: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<any>;
} & Omit<AntButtonProps, 'onClick'>;

export const Button = ({ onClick, ...props }: ButtonProps) => {
  const [loading, setLoading] = useState(false);
  const clickEvent: React.MouseEventHandler<HTMLElement> = async ev => {
    if (loading) return;
    setLoading(true);
    onClick?.(ev)?.finally(() => {
      setLoading(false);
    });
  };
  return <AntButton onClick={clickEvent} loading={loading} {...props} />;
};
export const ComsButton = ({ onClick, ...props }: ButtonProps) => {
  const field = useField<Field>();
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState(
    I18N.base.obtainVerificationCode,
  );
  const [countdown, setCountdown] = useState(0);

  const handleButtonClick = async () => {
    if (countdown > 0) return;
    setCountdown(120);
    setButtonText(I18N.base.retrieveInSeconds);

    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setButtonText(I18N.base.obtainVerificationCode);
          return 0;
        }
        setButtonText(
          I18N.template(I18N.base.prevC, { val1: prevCountdown - 1 }),
        );
        return prevCountdown - 1;
      });
    }, 1000);
  };
  const clickEvent: React.MouseEventHandler<HTMLElement> = async ev => {
    if (loading) return;
    setLoading(true);
    const data = await onClick?.(ev)?.finally(() => {
      setLoading(false);
    });
    if (data) {
      handleButtonClick();
    }
  };
  useEffect(() => {
    setCountdown(0);
    setLoading(false);
    setButtonText(I18N.base.obtainVerificationCode);
    return () => {
      setCountdown(0);
      setLoading(false);
      setButtonText(I18N.base.obtainVerificationCode);
    };
  }, [field]);
  return (
    <AntButton
      onClick={clickEvent}
      loading={loading}
      type='primary'
      disabled={countdown > 0}
      {...props}
    >
      {buttonText}
    </AntButton>
  );
};

export const FormilyComsButton = connect(ComsButton);
