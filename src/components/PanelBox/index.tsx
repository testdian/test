/**
 * @description: 封装左侧可展开收起的组件容器
 */
import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

import styles from './index.module.less';

const PanelBox: FC<
  PropsWithChildren<{
    hideTree: boolean;
    canHideTree: boolean;
    onHideTree: () => void;
  }>
> = ({ canHideTree, hideTree, onHideTree, children }) => {
  return (
    <>
      <div
        className={classNames(styles.panelBoxWrapper, {
          [styles.closePanelBoxWrapper]: hideTree,
        })}
      >
        <div className={styles.panelBoxContent}>{children}</div>
      </div>
      {canHideTree && (
        <div className={styles.accountTreeExpand}>
          <div
            className={styles.accountTreeExpandBtn}
            onClick={() => {
              onHideTree();
            }}
          />
        </div>
      )}
    </>
  );
};

export default PanelBox;
