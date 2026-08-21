/**
 * @file 碳排放核算/清单样式
 */
import { SearchOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { FC, useRef, useState } from 'react';

import usePageType from '@/hooks/usePageType';
import { PageTypeInfo } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';
import { getEmissionModalSourceListApi } from '@/views/eca/accountingModel/Info/service';
import {
  AccountModelInfoTreeDatum,
  EmissionSourceList,
} from '@/views/eca/accountingModel/Info/type';
import ChooseEmissionSource from '@/views/eca/component/ChooseEmissionSource';
import EmissionSourceDetailDrawer from '@/views/eca/component/EmissionSourceDetailDrawer';
import TreeCollapseList from '@/views/eca/component/TreeCollapseList';
import EmissionSourceTree from '@/views/eca/component/TreePanel';

import { listStyleColumns } from './columns';
import styles from './index.module.less';
import { ColumnsActionType } from '../../config';
import {
  addTaskEmissionSourceApi,
  deleteTaskEmissionSourceApi,
  withdrawTaskEmissionSourceApi,
} from '../../service';
import { AccountYearComputation, ComputationSourceRequest } from '../../type';
import AuditOrCheckDetailDrawer, { PageAuditType } from '../AuditDrawer';
import MatchFactorModal from '../MatchFactorModal';
import { calcEmissionSourceGroupFactorApi } from '../MatchFactorModal/service';

const { VIEW, EDIT, DELETE, MATCH_FACTOR, REVIEW, WITHDRAW } =
  ColumnsActionType;

const { add } = PageTypeInfo;

const ListStyleInfo: FC<{
  treeData: AccountModelInfoTreeDatum[];
  /** 核算id */
  computationId: number;
  /** 清单样式添加排放源成功 */
  onAddEmissionSourceSuccess: () => void;
  /** 核算信息 */
  accountingInfo: AccountYearComputation;
}> = ({
  treeData,
  computationId,
  onAddEmissionSourceSuccess,
  accountingInfo,
}) => {
  const { orgCode } = accountingInfo || {};

  /** 排放量单位 */
  const emissionUnit = accountingInfo?.emissionUnit_name
    ? `（${accountingInfo?.emissionUnit_name}）`
    : '';

  const tableRef = useRef<ActionType>();

  const isDetail = false;

  const { pageType, setModelAction } = usePageType(add);

  /** 设置匹配因子的 id 值 */
  const [matchFactorId, setMatchFactorId] = useState<number>();

  /** 是否收起左侧 tree */
  const [hideTree, setHideTree] = useState(false);

  /** 设置loading */
  const [loading] = useState(false);

  /** 排放源id */
  const [emissionSourceId, setEmissionSourceId] = useState<number>();

  /** 排放源详情数据 */
  const [emissionSourceDetail, setEmissionSourceDetail] =
    useState<ComputationSourceRequest>();

  /** 设置排放源弹窗loading */
  const [chooseEmissionSourceLoading, setChooseEmissionSourceLoading] =
    useState(false);

  /** 设置对应类别的弹窗中的排放源库列表数据 */
  const [modalEmissionSource, setModalEmissionSourceList] = useState<
    EmissionSourceList[]
  >([]);

  /** 选择排放源库弹窗 */
  const [chooseEmissionSourceVisible, setChooseEmissionSourceVisible] =
    useState(false);

  /** 设置弹窗显示 */
  const [modalStatus, setModalStatus] = useState({
    /** 匹配因子弹窗 */
    matchFactorVisible: false,
    /** 选择排放源弹窗中的详情信息弹窗  */
    emissionSourceDetailVisible: false,
    /** 选择排放源库弹窗 */
    chooseEmissionSourceVisible: false,
    /** 审核/详情抽屉 */
    auditOrDetailVisible: false,
  });

  /** 设置当前类别名称 */
  const [currentGhgClassifyName, setCurrentGhgClassifyName] = useState<{
    /** 范围类别名称 */
    name: string;
    /** 范围类别子名称 */
    childName: string;
    ghgCategory: number | undefined;
    ghgClassify: number | undefined;
  }>({
    name: '',
    childName: '',
    ghgCategory: undefined,
    ghgClassify: undefined,
  });

  /** 关闭弹窗 */
  const toggleModal = (modalName: keyof typeof modalStatus, open: boolean) => {
    setModalStatus(prev => ({
      ...prev,
      [modalName]: open,
    }));
  };

  /** 点击选择排放源获取的数据 */
  const getEmissionSourceListByGhgClassifyByModal = async (ghg: string) => {
    setChooseEmissionSourceLoading(true);
    const { data } = await getEmissionModalSourceListApi({
      ghg,
      computationId,
    }).finally(() => {
      setChooseEmissionSourceLoading(false);
    });
    setModalEmissionSourceList(data?.data);
  };

  /** 关闭选择排放源弹窗中的详情弹窗 */
  const onCloseOrSuccessInit = () => {
    toggleModal('emissionSourceDetailVisible', false);
    setEmissionSourceId(undefined);
  };

  // 操作处理函数（使用类型判断）
  const handleActionClick = async (
    actionType: ColumnsActionType,
    record: ComputationSourceRequest,
  ) => {
    switch (actionType) {
      case VIEW:
        // 处理查看逻辑
        setEmissionSourceDetail(record);
        setModelAction(PageTypeInfo.show);
        toggleModal('auditOrDetailVisible', true);
        break;
      case EDIT:
        // 处理编辑逻辑
        setEmissionSourceDetail(record);
        setModelAction(PageTypeInfo.edit);
        toggleModal('auditOrDetailVisible', true);
        break;
      case DELETE:
        // 处理删除逻辑
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.dashborad.pleaseConfirmIfItIs2,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            await deleteTaskEmissionSourceApi({ id: record.id });
            tableRef.current?.reload();
          },
        });

        break;
      case MATCH_FACTOR:
        // 处理匹配因子
        setMatchFactorId(record?.id);
        toggleModal('matchFactorVisible', true);
        setEmissionSourceDetail(record);
        break;
      case REVIEW:
        // 处理审核
        setEmissionSourceDetail(record);
        setModelAction(PageAuditType.audit as unknown as PageTypeInfo);
        toggleModal('auditOrDetailVisible', true);
        break;
      case WITHDRAW:
        // 处理撤回逻辑
        modal.confirm({
          title: I18N.Factors.prompt,
          content: I18N.eca.pleaseConfirmIfItIs4,
          okText: I18N.base.confirm,
          cancelText: I18N.Factors.cancel,
          onOk: async () => {
            if (!record.id) return;
            await withdrawTaskEmissionSourceApi({ idList: [record.id] });
            tableRef.current?.reload();
          },
        });
        break;
      default:
    }
  };

  /** 匹配因子计算 */
  const handleMatchFactor = async () => {
    try {
      if (!matchFactorId) return;
      // await calcEmissionSourceFactorApi({
      //   computationSourceId: Number(matchFactorId),
      // });
      await calcEmissionSourceGroupFactorApi({
        groupId: Number(matchFactorId),
      });
    } finally {
      setMatchFactorId(undefined);
      tableRef.current?.reload();
    }
  };

  return (
    <div className={styles.treeWrapperMain}>
      <div className={styles.treeWrapperLeft}>
        {/* 左侧排放源树 */}
        <EmissionSourceTree
          treeData={treeData}
          hideTree={hideTree}
          canHideTree
          onSelect={() => {}}
          onHideTree={() => {
            setHideTree(!hideTree);
          }}
          selectedKeys={[]}
        />
      </div>
      <div
        className={classNames(styles.treeSourceTable, {
          [styles.expandCollapseWrapper]: hideTree,
        })}
      >
        <TreeCollapseList
          loading={loading}
          treeData={treeData}
          onCollapseChange={() => {}}
          isDetail={isDetail}
          renderChildren={(childrenItem, item) => {
            const computationSourceList = (
              childrenItem as unknown as {
                computationSourceList: EmissionSourceList[];
              }
            )?.computationSourceList;
            return (
              <>
                {false && (
                  <Button
                    style={{ margin: '8px 0' }}
                    type='primary'
                    icon={<SearchOutlined />}
                    onClick={async () => {
                      setCurrentGhgClassifyName({
                        name: item?.name,
                        childName: childrenItem?.name,
                        ghgCategory: item?.code,
                        ghgClassify: childrenItem?.code,
                      });
                      setChooseEmissionSourceVisible(true);
                      await getEmissionSourceListByGhgClassifyByModal(
                        [item?.code, childrenItem?.code].toString(),
                      );
                    }}
                  >
                    {I18N.eca.fromEmissionSourceRepository}
                  </Button>
                )}
                {!!computationSourceList?.length && (
                  <ProTable
                    actionRef={tableRef}
                    search={false}
                    size='small'
                    toolBarRender={false}
                    columns={listStyleColumns(handleActionClick, emissionUnit)}
                    dataSource={computationSourceList}
                    rowKey='id'
                    pagination={{
                      showSizeChanger: true,
                      showTotal: undefined,
                    }}
                  />
                )}
              </>
            );
          }}
        />
      </div>
      {/* 选择排放源库弹窗 */}
      <ChooseEmissionSource
        loading={chooseEmissionSourceLoading}
        modelId={Number(computationId)}
        emissionSource={modalEmissionSource}
        visible={chooseEmissionSourceVisible}
        currentGhgClassifyName={currentGhgClassifyName}
        onCancel={() => {
          setChooseEmissionSourceVisible(false);
        }}
        onSaveSuccess={async (computationIdValue, selectedData) => {
          await addTaskEmissionSourceApi({
            computationId: Number(computationIdValue),
            emissionSourceCodeList: selectedData,
            orgCode,
          });
          Toast(
            'success',
            I18N.supplyChainCarbonManagement.operationSuccessful,
          );
          setChooseEmissionSourceVisible(false);
          onAddEmissionSourceSuccess?.();
        }}
        onEmissionItemModalClick={id => {
          setEmissionSourceId(id);
          toggleModal('emissionSourceDetailVisible', true);
        }}
      />
      {/* 任务样式/匹配因子弹窗 */}
      <MatchFactorModal
        emissionSourceDetail={emissionSourceDetail as ComputationSourceRequest}
        matchFactorId={matchFactorId as number}
        visible={modalStatus.matchFactorVisible}
        onCancel={async () => {
          toggleModal('matchFactorVisible', false);
          handleMatchFactor();
        }}
        onSave={async () => {
          toggleModal('matchFactorVisible', false);
          handleMatchFactor();
        }}
      />
      {/* 清单样式/排放源详情数据/收集模板无用户的填报的数据抽屉 */}
      <EmissionSourceDetailDrawer
        visible={modalStatus.emissionSourceDetailVisible}
        onClose={() => {
          onCloseOrSuccessInit();
        }}
        emissionSourceId={Number(emissionSourceId)}
        actionType={PageTypeInfo.show}
      />
      {/* 清单样式/排放源审核/详情抽屉 */}
      <AuditOrCheckDetailDrawer
        isGroup
        computationSourceIdList={compact([emissionSourceDetail?.id])}
        visible={modalStatus.auditOrDetailVisible}
        actionType={pageType as unknown as PageTypeInfo & PageAuditType}
        emissionSourceDetail={emissionSourceDetail as ComputationSourceRequest}
        onClose={() => {
          setModelAction(add);
          setEmissionSourceDetail(undefined);
          toggleModal('auditOrDetailVisible', false);
        }}
        onSuccessSave={() => {
          Toast(
            'success',
            I18N.supplyChainCarbonManagement.operationSuccessful,
          );
          setModelAction(add);
          setEmissionSourceDetail(undefined);
          toggleModal('auditOrDetailVisible', false);
        }}
      />
    </div>
  );
};
export default ListStyleInfo;
