// 新建 components/TreeCollapseList/index.tsx
import { SearchOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button, Collapse, Space, Spin } from 'antd';

import styles from './index.module.less'; // 需要创建对应样式文件
import { AccountModelInfoTreeDatum } from '../../accountingModel/Info/type';

export interface TreeCollapseListProps {
  /** 树形数据 */
  treeData: AccountModelInfoTreeDatum[];
  /** 加载状态 */
  loading?: boolean;
  /** 当前激活的 collapse key */
  activeKeys?: string[];
  /** collapse 切换回调 */
  onCollapseChange?: (keys: string | string[]) => void;
  /** 是否详情模式 */
  isDetail?: boolean;
  /** 自定义渲染子内容 */
  renderChildren?: (
    childrenItem: AccountModelInfoTreeDatum,
    item: AccountModelInfoTreeDatum,
  ) => React.ReactNode;
}

const TreeCollapseList = ({
  treeData,
  loading,
  activeKeys,
  onCollapseChange,
  isDetail,
  renderChildren,
}: TreeCollapseListProps) => {
  return (
    <Spin spinning={loading}>
      {treeData.map(item => {
        const { name, children, code } = item;
        if (!code) return null;

        const header = (
          <div className={styles.categoryHeader}>
            <div className={styles.headerCategoryName}>{name}</div>
          </div>
        );

        return (
          <Collapse
            key={`${code}_${name}`}
            activeKey={activeKeys}
            onChange={onCollapseChange}
            className={styles.wrapperCollapse}
          >
            <Collapse.Panel header={header} key={`${code}_${name}`}>
              {children?.map(childItem => (
                <Collapse
                  key={childItem.code}
                  activeKey={activeKeys}
                  onChange={onCollapseChange}
                  className={styles.innerCollapse}
                >
                  <Collapse.Panel
                    key={childItem.code}
                    header={
                      <div className={styles.categoryHeader}>
                        <div className={styles.headerCategoryName}>
                          {childItem.name}
                        </div>
                      </div>
                    }
                  >
                    {renderChildren ? (
                      renderChildren(childItem, item)
                    ) : (
                      <Space direction='vertical' style={{ width: '100%' }}>
                        {/* 默认子内容渲染逻辑 */}
                        {!isDetail && (
                          <Button
                            type='primary'
                            icon={<SearchOutlined />}
                            onClick={() => {
                              /* 默认点击处理 */
                            }}
                          >
                            {I18N.eca.fromEmissionSourceRepository}
                          </Button>
                        )}
                      </Space>
                    )}
                  </Collapse.Panel>
                </Collapse>
              ))}
            </Collapse.Panel>
          </Collapse>
        );
      })}
    </Spin>
  );
};

export default TreeCollapseList;
