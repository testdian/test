/**
 * @description formily TextArea
 */
import { connect, mapReadPretty } from '@formily/react';
import { Input as AntdInput } from 'antd';
import { CSSProperties } from 'react';

const Text = (props: {
  value: string | number | readonly string[] | undefined;
  style?: CSSProperties | undefined;
  rows?: number;
}) => {
  return (
    <AntdInput.TextArea
      disabled
      {...props}
      value={props.value || '-'}
      style={{ ...props?.style, color: '#333', border: 'none' }}
    />
  );
};

export const TextArea = connect(AntdInput.TextArea, mapReadPretty(Text));
