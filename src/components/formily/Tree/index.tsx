/*
 * @@description: 为formily 打造的 tree 组件
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-03 15:44:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-17 15:06:08
 */
import { Field } from '@formily/core';
import { connect, mapProps, useField } from '@formily/react';
import { Tree as AntTree, TreeProps } from 'antd';
import { IconType } from 'antd/es/notification/interface';
import { DataNode } from 'antd/lib/tree';
import classNames from 'classnames';
import { PropsWithChildren, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';

import style from './index.module.less';

export interface BasicDataNode {
  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  isLeaf?: boolean;
  selectable?: boolean;
  switcherIcon?: IconType;
  /** Set style of TreeNode. This is not recommend if you don't have any force requirement */
  className?: string;
  style?: React.CSSProperties;
}

export type NewTreeProps<T extends BasicDataNode | DataNode = DataNode> =
  PropsWithChildren<TreeProps<T>> & {
    // eslint-disable-next-line react/no-unused-prop-types
    readonly?: boolean;
  };

const NewTree = <T extends BasicDataNode | DataNode = DataNode>({
  ...props
}: NewTreeProps<T>) => {
  const field = useField<Field>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const { pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
  }>();
  const onExpand = (expandedKeysValue: React.Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  return pageTypeInfo === PageTypeInfo.show ? (
    <AntTree
      {...props}
      key={JSON.stringify(props)}
      checkedKeys={field?.form.values[field.path.toString()]}
    />
  ) : (
    <AntTree
      {...props}
      {...{ expandedKeys, autoExpandParent, onExpand }}
      key={JSON.stringify(props)}
      checkedKeys={field?.form.values[field.path.toString()]}
      className={classNames(props.className, {
        [style.readonly]: field.readPretty,
      })}
      onCheck={(ev, target) => {
        // field.setValue(ev);
        // @ts-ignore
        props?.onChange(ev);
        // 部分页面可能需要更多的信息，目前只能通过这种方式暴露出去
        // @ts-ignore
        props?.onCheck(target);
      }}
    />
  );
};
export const Tree = connect(
  NewTree,
  mapProps({ dataSource: 'treeData' }, props => {
    return {
      ...props,
    };
  }),
  // mapReadPretty(NewTree, { readonly: true }),
);
