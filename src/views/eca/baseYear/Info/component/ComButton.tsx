/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-06-15 09:33:26
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-15 09:59:24
 */
import { Button } from 'antd';
import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from 'react';

export const ComButton = (props: {
  onclickFn: () => void;
  title:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  return (
    <Button
      onClick={() => {
        props.onclickFn();
      }}
      type='primary'
      style={{ float: 'right' }}
    >
      {props.title}
    </Button>
  );
};
