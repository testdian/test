import { Table } from 'antd';
import type { TableProps } from 'antd/es/table';
import classNames from 'classnames';
import { useRef } from 'react';

import styles from './index.module.less';
import { useHorizontalTableDrag } from './useHorizontalTableDrag';

type HorizontalDragTableProps<T extends object> = TableProps<T> & {
  scrollX?: number | string;
  wrapClassName?: string;
};

export function HorizontalDragTable<T extends object>({
  scrollX = 'max-content',
  wrapClassName,
  className,
  scroll,
  ...props
}: HorizontalDragTableProps<T>) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useHorizontalTableDrag(wrapRef, [props.loading, props.dataSource?.length]);

  return (
    <div ref={wrapRef} className={classNames(styles.wrap, wrapClassName)}>
      <Table
        {...props}
        className={classNames(styles.table, className)}
        tableLayout='fixed'
        scroll={{ ...scroll, x: scrollX }}
      />
    </div>
  );
}

export { sumColumnWidths, useHorizontalTableDrag } from './useHorizontalTableDrag';
