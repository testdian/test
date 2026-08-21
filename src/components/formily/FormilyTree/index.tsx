/**
 * @description Tree 组件
 */
import { Field } from '@formily/core';
import { connect, mapProps, useField } from '@formily/react';
import { Tree as AntTree, TreeProps } from 'antd';
import classNames from 'classnames';
import { Key } from 'react';

import style from './index.module.less';

const Tree = ({
  ...props
}: TreeProps & {
  onChange?: (
    ev:
      | Key[]
      | {
          checked: Key[];
          halfChecked: Key[];
        },
  ) => void;
}) => {
  const field = useField<Field>();

  return (
    <AntTree
      key={JSON.stringify(props)}
      className={classNames(props.className, {
        [style.readonly]: field.readPretty,
      })}
      {...props}
      checkedKeys={field?.form.values[field.path.toString()]}
      onCheck={ev => {
        props.onChange?.(ev);
      }}
    />
  );
};
export const FormilyTree = connect(
  Tree,
  mapProps({ dataSource: 'treeData' }, props => {
    return {
      ...props,
    };
  }),
  // mapReadPretty(NewTree, { readonly: true }),
);
