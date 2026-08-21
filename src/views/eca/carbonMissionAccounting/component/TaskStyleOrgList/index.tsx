/**
 * @file 碳排放核算/任务样式-核算组织列表
 */
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Spin } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { FC, useEffect, useRef, useState } from 'react';

import PanelBox from '@/components/PanelBox';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { OrgTree } from '@/hooks/useOrgTreeData/type';
import { ORG_TYPE } from '@/utils/const';
import { OrganizationTree } from '@/views/components/OrganizationTree';

import CarbonEmissionDetail from './EmissionInfoList';
import { columns } from './columns';
import styles from './index.module.less';
import { getTaskTreeListApi } from './service';
import { ComputationOrgTreeResp } from './type';
import { ColumnsActionType } from '../../config';
import { AccountYearComputation } from '../../type';

const { VIEW } = ColumnsActionType;

const TaskStyleOrgList: FC<{
  /** 核算信息 */
  accountingInfo: AccountYearComputation;
  /** 当前年份 */
  currentYear: number;
}> = ({ accountingInfo, currentYear }) => {
  const orgVersion = accountingInfo?.orgVersion;

  /** 排放量单位 */
  const emissionUnit = accountingInfo?.emissionUnit_name
    ? `（${accountingInfo?.emissionUnit_name}）`
    : '';

  const taskTableRef = useRef<ActionType>();

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedNode, setSelectedNode] = useState<OrgTree | undefined>(
    undefined,
  );

  const [treeData, refresh, loading] = useOrgTreeData({
    orgVersion,
  });

  /** 是否收起左侧 tree */
  const [hideTree, setHideTree] = useState(false);

  /** 记录哪些行切换到了合计值模式（使用 Set 存储 code） */
  const [showTotalValueCodes, setShowTotalValueCodes] = useState<Set<string>>(
    new Set(),
  );

  /** 展开的行 keys */
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  /** 递归收集所有有子级的行的 key */
  const collectExpandableKeys = (
    data: ComputationOrgTreeResp[],
    keys: React.Key[] = [],
  ): React.Key[] => {
    data.forEach(item => {
      if (item.children && item.children.length > 0 && item.code) {
        keys.push(item.code);
        collectExpandableKeys(item.children, keys);
      }
    });
    return keys;
  };

  /** 切换某行的显示模式（自身值/合计值） */
  const toggleRowDisplayMode = (code: string) => {
    setShowTotalValueCodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  /** 是否显示详情 */
  const [showDetail, setShowDetail] = useState(false);

  /** 当前行数据 */
  const [currentRowData, setCurrentRowData] = useState<ComputationOrgTreeResp>(
    {},
  );

  // 操作处理函数（使用类型判断）
  const handleActionClick = async (
    actionType: ColumnsActionType,
    record: ComputationOrgTreeResp,
  ) => {
    switch (actionType) {
      case VIEW:
        // 处理查看逻辑
        setCurrentRowData(record);
        setShowDetail(true);
        break;
      default:
    }
  };

  useEffect(() => {
    refresh(orgVersion);
  }, [orgVersion]);

  return (
    <div className={styles.treeWrapperMain}>
      <div className={styles.treeWrapperLeft}>
        {/* 左侧组织树 */}
        <PanelBox
          canHideTree
          hideTree={hideTree}
          onHideTree={() => {
            setHideTree(!hideTree);
          }}
        >
          <Spin spinning={loading}>
            <OrganizationTree
              treeData={treeData}
              refresh={() => {
                refresh(orgVersion);
              }}
              selectedKeys={selectedKeys}
              onSelect={(keys, info: { selected: boolean; node: OrgTree }) => {
                /** 虚拟组织不选中 */
                const isVirtual = info.node.realVirtual === ORG_TYPE.VIRTUAL;
                if (isVirtual) {
                  return;
                }
                if (info.selected) {
                  setSelectedNode(info.node);
                } else {
                  setSelectedNode(undefined);
                }
                setSelectedKeys(keys);
              }}
              headerTitle='核算组织列表'
              showActionBtn={false}
            />
          </Spin>
        </PanelBox>
      </div>
      <div
        className={classNames(styles.treeSourceTable, {
          [styles.expandCollapseWrapper]: hideTree,
        })}
      >
        <div className={styles.tableWrapper}>
          <ProTable
            actionRef={taskTableRef}
            search={false}
            size='small'
            toolBarRender={false}
            columns={columns(
              handleActionClick,
              showTotalValueCodes,
              toggleRowDisplayMode,
              emissionUnit,
            )}
            rowKey='code'
            scroll={{ x: 'max-content' }}
            pagination={false}
            expandable={{
              expandedRowKeys,
              onExpandedRowsChange: keys => {
                setExpandedRowKeys([...keys]);
              },
            }}
            params={{
              orgCode: selectedNode?.code || '',
              year: accountingInfo?.year || undefined,
            }}
            request={async params => {
              const { data } = await getTaskTreeListApi(params);

              const list = compact([data?.data]);

              // 收集所有有子级的行的 key，默认展开
              const expandableKeys = collectExpandableKeys(list);
              setExpandedRowKeys(expandableKeys);

              return {
                data: list,
                success: true,
                total: list?.length || 0,
              };
            }}
          />
        </div>
      </div>

      {/* 详情 */}
      {showDetail && (
        <div className={styles.detailWrapper}>
          <CarbonEmissionDetail
            hasAccountingTask={accountingInfo}
            currentYear={currentYear}
            baseInfo={currentRowData}
            onBackOrgList={() => {
              setShowDetail(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
export default TaskStyleOrgList;
