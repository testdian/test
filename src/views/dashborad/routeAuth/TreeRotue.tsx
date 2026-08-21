/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-06 19:33:56
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-08 20:05:53
 */
/* eslint-disable */
import { Tree as AntTree, TreeProps } from 'antd';
import { Tree } from '@/sdks/systemV2ApiDocs';
import { Key } from 'react';

export interface TreeRouteProps {
  treeList?: Tree[];
  selectedKeys?: Key[];
  onSelect: TreeProps['onSelect'];
}

function TreeRoute(props: TreeRouteProps) {
  const { treeList, onSelect, selectedKeys } = props;

  // 递归当前的树 找到所有符合的Id
  const fromIdBykey = (keys: string[], tree: any[], ids: number[] = []) => {
    tree.forEach(item => {
      if (keys.includes(item.key)) {
        ids.push(item.id);
      }
      fromIdBykey(keys, item.children, ids);
    });
    return ids;
  };

  return (
    <AntTree
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      // @ts-ignore
      treeData={treeList}
      fieldNames={{ title: 'name', key: 'code' }}
    />
  );
}
export default TreeRoute;
