/*
 * @@description:标签
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-17 14:35:36
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-14 16:15:26
 */

import { Tag, TagProps, Typography } from 'antd';
import classNames from 'classnames';

import styles from './index.module.less';

export type OtherTagProps = {
  kind?: 'raduis' | 'badge' | 'delete' | 'overlength';
  tagText: string;
  color: string | 'orange' | 'blue' | 'red' | 'default' | 'green';
};

export type BaseTagProps = TagProps & OtherTagProps;
const { Text } = Typography;

export const Tags = ({ kind, className, ...props }: BaseTagProps) => {
  const getKind = (tagKinds: OtherTagProps['kind']) => {
    switch (tagKinds) {
      case 'raduis':
        return styles.radiusTags;
      case 'badge':
        return styles.badgeTags;
      case 'delete':
        return styles.deleteTags;
      default:
        return styles.baseTags;
    }
  };
  return (
    <Tag {...props} className={classNames(getKind(kind), className)}>
      <Text
        className={
          kind === 'overlength' ? styles.overlengthTags : styles.tagWord
        }
        ellipsis={kind === 'overlength' ? { tooltip: props.tagText } : false}
      >
        {props.tagText}
      </Text>
    </Tag>
  );
};
