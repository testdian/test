/**
 * @description: 封装左侧 tree 和 canHideTree 部分的组件
 */
import { CaretRightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { FC, Key, useEffect, useState } from 'react';

import ghgClassifyImg from './images/classify.svg';
import secondGhgClassifyImg from './images/secondClassify.svg';
import styles from './index.module.less';
import { AccountModelInfoTreeDatum } from '../../accountingModel/Info/type';

// 封装左侧 tree 和 canHideTree 部分的组件
const EmissionSourceTree: FC<{
  treeData: AccountModelInfoTreeDatum[];
  hideTree: boolean;
  canHideTree: boolean;
  onSelect: (selectedKey: Key[], info: any) => void;
  onHideTree: () => void;
  selectedKeys: Key[];
}> = ({
  treeData,
  canHideTree,
  hideTree,
  onSelect,
  onHideTree,
  selectedKeys,
}) => {
  // 新增展开状态管理
  // 修改状态初始化部分
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    // 初始展开所有有子节点的项
    const initialKeys = new Set(
      treeData
        .filter(node => node.children?.length)
        .map(node => node.code?.toString()),
    );
    return initialKeys;
  });
  // 处理展开/收起
  const handleExpand = (code: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      newSet.has(code) ? newSet.delete(code) : newSet.add(code);
      return newSet;
    });
  };

  useEffect(() => {
    if (treeData.length) {
      const newKeys = new Set(
        treeData
          .filter(node => node.children?.length)
          .map(node => node.code?.toString())
          .filter(Boolean),
      );
      setExpandedKeys(newKeys);
    }
    // 当treeData变化时重新计算展开项
  }, [treeData]);
  return (
    <>
      {/* 左侧 tree */}
      <div
        className={classNames(styles.treeWrapper, {
          [styles.closeTreeWrapper]: hideTree,
        })}
      >
        <div className={styles.treeBox}>
          {treeData?.map?.(({ code, name, children, num }) => {
            const isExpanded = code && expandedKeys?.has(code.toString());
            return (
              <div
                className={styles.ghgClassifyContent}
                key={`${code}_${name}`}
              >
                <div
                  className={classNames(styles.ghgClassify, {
                    [styles.selected]:
                      selectedKeys.length === 1 && selectedKeys[0] === code,
                  })}
                  onClick={() => {
                    // @ts-ignore
                    // onSelect(selectedKeys.includes(code) ? [] : [code], {
                    //   node: { code },
                    // });
                    onSelect([code], {
                      node: { code },
                    });
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    {/* 如果code是null 不展示 */}
                    {code && (
                      <CaretRightOutlined
                        className={classNames(styles.caretIcon, {
                          [styles.rotated]: isExpanded,
                        })}
                        onClick={e => {
                          e.stopPropagation();
                          handleExpand(code.toString());
                        }}
                      />
                    )}
                    <img src={ghgClassifyImg} alt='' />
                  </div>
                  <div className={styles.classifyName}>{name}</div>
                  <div className={styles.count}>{num || 0}</div>
                </div>
                {(children || []).map(child => {
                  const childName = child.name;
                  return (
                    <div
                      className={classNames(styles.childrenContainer, {
                        [styles.collapsed]: !isExpanded,
                      })}
                    >
                      <div
                        className={classNames(styles.secondGhgClassify, {
                          [styles.selected]:
                            selectedKeys.length === 2 &&
                            selectedKeys[1] === child.code,
                        })}
                        key={`${child.code}_${child.name}`}
                        onClick={() => {
                          // onSelect(
                          //   // @ts-ignore
                          //   selectedKeys.includes(child.code)
                          //     ? []
                          //     : [code, child.code],
                          //   { node: { key: child.code } },
                          // );
                          onSelect([code, child.code], {
                            node: { key: child.code },
                          });
                        }}
                      >
                        <img src={secondGhgClassifyImg} alt='' />
                        <div className={styles.classifyName}>
                          <div className={styles.categoryName}>
                            {childName ?? childName}
                          </div>
                        </div>
                        <div className={styles.count}>{child.num || 0}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
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

export default EmissionSourceTree;
