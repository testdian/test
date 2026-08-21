import versionIcon from '@src/image//assets/versionIcon.svg';
import addIcon from '@src/image/assets/add.svg';
import company from '@src/image/assets/company.svg';
import del from '@src/image/assets/del.svg';
import { Dropdown, Menu, Tree, Input, Tooltip } from 'antd';
import type { DataNode } from 'antd/es/tree';
import classNames from 'classnames';
import { difference, isUndefined } from 'lodash-es';
import { FC, Key, useEffect, useMemo, useState } from 'react';

import { modal } from '@/store/module/notification';
import { modalText, modelFooterBtnStyle } from '@/utils';
import { ORG_TYPE } from '@/utils/const';

import styles from './index.module.less';
import { deleteOrgApi } from './services';
import { OrgTree } from './type';
import { AddOrganization } from '../../dashborad/organization/components/AddOrganization';

const { Search } = Input;

const menu = (treeData: OrgTree[], initPid: string, refresh: () => void) => (
  <Menu>
    <Menu.Item key={1}>
      <AddOrganization initPid={initPid} treeData={treeData} refresh={refresh}>
        新增核算组织
      </AddOrganization>
    </Menu.Item>
  </Menu>
);

function TransformTreeData(
  treeData: OrgTree[],
  refresh: () => void,
  depth: number,
): OrgTree[] {
  return treeData.map(item => ({
    ...item,
    key: item.code,
    depth,
    children: item.children
      ? TransformTreeData(item.children, refresh, depth + 1)
      : [],
  }));
}

interface OrganizationTreeProps {
  /** 树数据 */
  treeData: OrgTree[];
  /** 刷新回调 */
  refresh: () => void;
  /** 版本管理点击回调 */
  onVersionManageClick?: () => void;
  /** 选择回调 */
  onSelect?: (selectedKeys: React.Key[], info: any) => void;
  /** 选中节点 */
  selectedKeys?: React.Key[];
  /** 是否展示操作按钮 */
  showActionBtn?: boolean;
  /** 标题 */
  headerTitle?: string;
  /** 是否隐藏搜索 */
  hiddenSearch?: boolean;
}

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const renderCompanyTitle = ({
  name,
  treeData,
  code,
  refresh,
  expandedKeys,
  setExpandedKeys,
  allExpandedKeys,
  showActionBtn,
}: {
  name: string;
  treeData: OrgTree[];
  code: string;
  refresh: () => void;
  expandedKeys: React.Key[];
  setExpandedKeys: (value: React.Key[]) => void;
  allExpandedKeys: React.Key[];
  showActionBtn?: boolean;
}) => {
  const canExpand = allExpandedKeys.length > expandedKeys.length;
  return (
    <div className={styles.companyTitleWrapper}>
      <div className={styles.info}>
        <Tooltip overlay={canExpand ? '点击展开' : '点击折叠'}>
          <div
            className={styles.logo}
            onClick={e => {
              e.stopPropagation();
              if (canExpand) {
                setExpandedKeys(allExpandedKeys);
              } else {
                setExpandedKeys([code]);
              }
            }}
          >
            <img src={company} alt='' />
          </div>
        </Tooltip>
        <div
          className={classNames(styles.name, {
            [styles.actionName]: showActionBtn,
          })}
        >
          {name}
        </div>
      </div>
      {showActionBtn && (
        <div className={styles.more} onClick={e => e.stopPropagation()}>
          <Dropdown overlay={menu(treeData, code, refresh)}>
            <img src={addIcon} alt='' />
          </Dropdown>
        </div>
      )}
    </div>
  );
};

const renderOrgTitle = (params: {
  node: OrgTree;
  treeData: OrgTree[];
  refresh: () => void;
  showActionBtn?: boolean;
}) => {
  const { node, treeData, refresh, showActionBtn } = params;
  const { name, code, id } = node;
  return (
    <div className={styles.orgTitleWrapper}>
      <div className={styles.info}>
        <div
          className={classNames(styles.name, {
            [styles.actionName]: showActionBtn,
          })}
        >
          {name}
        </div>
      </div>
      {showActionBtn && (
        <div className={styles.more} onClick={e => e.stopPropagation()}>
          <div
            className={styles.del}
            onClick={e => {
              e.stopPropagation();
              modal.confirm({
                title: '提示',
                content: (
                  <div>
                    确认删除组织：<span className={modalText}>{name}？</span>
                    删除组织时不应影响现有的核算任务
                  </div>
                ),
                ...modelFooterBtnStyle,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await deleteOrgApi({ id });
                  refresh();
                },
              });
            }}
          >
            <Tooltip overlay='删除'>
              <img src={del} alt='' />
            </Tooltip>
          </div>

          <Dropdown overlay={menu(treeData, code, refresh)}>
            <img src={addIcon} alt='' />
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export const OrganizationTree: FC<OrganizationTreeProps> = props => {
  const {
    onSelect,
    selectedKeys,
    treeData,
    refresh,
    onVersionManageClick,
    showActionBtn,
    headerTitle = '组织列表',
    hiddenSearch,
  } = props;
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const transTreeData = useMemo(
    () => TransformTreeData(treeData, refresh, 0),
    [treeData],
  );

  const allExpandedKeys = useMemo(() => {
    const keys: React.Key[] = [];
    const generateKeys = (data: OrgTree[]) => {
      data.forEach(item => {
        if (item?.children && item?.children?.length > 0) {
          keys.push(item?.code);
          generateKeys(item.children);
        }
      });
    };
    generateKeys(treeData);
    return keys;
  }, [treeData]);

  useEffect(() => {
    const needAddKeys = [treeData?.[0]?.code].filter(
      item => !isUndefined(item),
    );
    setExpandedKeys(pre => [...pre, ...difference(needAddKeys, pre)]);
  }, [treeData]);

  const dataList = useMemo(() => {
    const list: any[] = [];
    const generateList = (data: DataNode[]) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key } = node;
        list.push({ title: key as string, ...node });
        if (node.children) {
          generateList(node.children);
        }
      }
    };

    generateList(transTreeData);
    return list;
  }, [transTreeData]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.key, transTreeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  return (
    <div className={styles.treeWrapper}>
      <div className={styles.headerTitle}>
        <div className={styles.headerTitleItem}>{headerTitle}</div>
        {onVersionManageClick && (
          <div
            className={styles.versionManageWrapper}
            onClick={() => {
              // 跳转到版本管理的方法
              onVersionManageClick?.();
            }}
          >
            <img src={versionIcon} alt='' />
            版本管理
          </div>
        )}
      </div>
      {!hiddenSearch && (
        <div style={{ flexShrink: 0, marginBottom: 16 }}>
          <Search
            value={searchValue}
            placeholder='组织名称'
            onChange={onChange}
          />
        </div>
      )}
      <Tree<OrgTree>
        blockNode
        treeData={transTreeData}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        titleRender={node => {
          if (node.realVirtual === ORG_TYPE.VIRTUAL) {
            return renderCompanyTitle({
              name: node.name,
              treeData,
              code: node.code,
              refresh,
              expandedKeys,
              setExpandedKeys,
              allExpandedKeys,
              showActionBtn,
            });
          }
          return renderOrgTitle({
            node,
            treeData,
            refresh,
            showActionBtn,
          });
        }}
        rootClassName={styles.tree}
        autoExpandParent={autoExpandParent}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        fieldNames={{
          key: 'code',
          title: 'name',
        }}
      />
    </div>
  );
};
