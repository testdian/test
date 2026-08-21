/**
 * @description: 核算模型表单
 */

import { SearchOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import classNames from 'classnames';
import { compact, last } from 'lodash-es';
import { FC, Key, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo } from '@/router/utils/enums';
import { getSearchParams, Toast } from '@/utils';
import ApprovalConfigModal from '@/views/eca/component/ApprovalConfigModal';
import ChooseEmissionSource from '@/views/eca/component/ChooseEmissionSource';
import EmissionSourceDetailDrawer from '@/views/eca/component/EmissionSourceDetailDrawer';
import TreeCollapseList from '@/views/eca/component/TreeCollapseList';
import EmissionSourceTree from '@/views/eca/component/TreePanel';

import styles from './index.module.less';
import { ANALYSIS_STEP_TYPE } from '../config';
import {
  addAccountModelEmissionSourceApi,
  deleteAccountModelEmissionSourceApi,
  getAccountModelEmissionSourceTreeApi,
  getEmissionModalSourceListApi,
} from '../service';
import { AccountModelInfoTreeDatum, EmissionSourceList } from '../type';
import { sourceColumns } from './columns';
import AccountEmissionSourceDrawer from './components/AccountEmissionSourceDrawer';

const AccountingModelInfo: FC<{
  /** 如果是在抽屉中查看 */
  drawerOptions?: {
    currentStep: number;
    isDrawer: boolean;
    isDetail: boolean;
    isNoFooter?: boolean;
    drawerAccountModelId?: number;
  };
}> = ({ drawerOptions }) => {
  const navigate = useNavigate();

  const params = useParams<{ id: string }>();

  /** 优先使用抽屉传入的ID */
  const modelId = useMemo(
    () => drawerOptions?.drawerAccountModelId || params?.id,
    [drawerOptions, params?.id],
  );

  /** 页面详情状态 */
  const { isDetail: pageIsDetail } = usePageInfo();

  const isDrawerDetail = drawerOptions?.isDetail || false;

  /** 页面详情状态 */
  const isDetail = drawerOptions ? isDrawerDetail : pageIsDetail;

  /** URL 携带的参数 */
  const search = { ...getSearchParams()[0] };

  /** 审批配置弹窗 */
  const [approvalConfigVisible, setApprovalConfigVisible] = useState(false);

  // 优先使用抽屉传入的步骤，其次使用URL参数
  const currentStep = useMemo(() => {
    // 显式判断undefined，避免0被误判
    const drawerStep =
      drawerOptions?.currentStep !== undefined
        ? drawerOptions.currentStep
        : Number(search?.currentStep);

    // 兜底默认值处理
    return Number.isNaN(drawerStep)
      ? ANALYSIS_STEP_TYPE.SELECT_DATA
      : drawerStep;
  }, [drawerOptions?.currentStep, search?.currentStep]);

  const [, setActiveKeys] = useState<string[]>([]);

  const [, setSelectedKeys] = useState<Key[]>([]);

  /** 是否收起左侧 tree */
  const [hideTree, setHideTree] = useState(false);

  /** 左侧 tree 数据 */
  const [treeData, setTreeData] = useState<AccountModelInfoTreeDatum[]>([]);

  /** 保存按钮loading */
  const [btnLoading] = useState(false);

  /** 保存按钮禁用 */
  const [isAnalysisButtonDisabled] = useState(false);

  /** 主题内容加载中 */
  const [loading, setLoading] = useState(false);

  /** 选择排放源库弹窗 */
  const [chooseEmissionSourceVisible, setChooseEmissionSourceVisible] =
    useState(false);

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

  /** 设置对应类别的弹窗中的排放源库列表数据 */
  const [modalEmissionSource, setModalEmissionSourceList] = useState<
    EmissionSourceList[]
  >([]);

  /** 设置排放源弹窗loading */
  const [chooseEmissionSourceLoading, setChooseEmissionSourceLoading] =
    useState(false);

  /** 排放源id */
  const [emissionSourceId, setEmissionSourceId] = useState<number>();

  /** 排放源详情信息弹窗 */
  const [emissionSourceDetailVisible, setEmissionSourceDetailVisible] =
    useState(false);

  /** 排放源编辑弹窗 */
  const [emissionSourceEditVisible, setEmissionSourceEditVisible] =
    useState(false);

  /** 返回核算模型 */
  const saveAnalysis = async () => {
    navigate(EcaRouteMaps.accountingModel);
  };

  /** 获取分类下新增排放源弹窗中的数据  */
  const getEmissionSourceListByGhgClassify = async (ghg: string) => {
    setChooseEmissionSourceLoading(true);
    const { data } = await getEmissionModalSourceListApi({
      ghg,
    }).finally(() => {
      setChooseEmissionSourceLoading(false);
    });
    setModalEmissionSourceList(data?.data);
  };

  /** 选择左侧树滑动右侧内容 */
  const onSelect = (selectedKey: Key[], info: any) => {
    document.getElementById(selectedKey[0] as string)?.scrollIntoView({
      behavior: 'smooth',
    });
    if (selectedKey.length) {
      setActiveKeys(pre => [...pre, selectedKey[0] as string]);
    } else {
      setActiveKeys(pre => pre.filter(item => item !== info.node.key));
    }
    setSelectedKeys(selectedKey);
  };
  /** 主体内容Collapse事件 */
  const collapseChange = (key: string | string[]) => {
    setActiveKeys(key as string[]);
    if (last(key)) {
      setSelectedKeys([last(key) as string]);
    }
  };

  /** 获取排放源左侧tree */
  const getEmissionSourceTree = async () => {
    if (modelId) {
      setLoading(true);
      const { data } = await getAccountModelEmissionSourceTreeApi(
        Number(modelId),
      ).finally(() => setLoading(false));
      setTreeData(data?.data);
    }
  };

  /** 刷新操作 */
  const onRefresh = () => {
    getEmissionSourceTree();
  };

  /** 编辑 */
  const onEdit = (record: EmissionSourceList) => {
    setEmissionSourceId(record.id);
    setEmissionSourceEditVisible(true);
  };

  /** 详情 */
  const onDetailClick = (record: EmissionSourceList) => {
    setEmissionSourceId(record.id);
    setEmissionSourceDetailVisible(true);
  };

  /** 删除 */
  const onDelete = async (record: EmissionSourceList) => {
    await deleteAccountModelEmissionSourceApi(Number(modelId), record.id);
    Toast('success', I18N.Factors.deleteSuccessful);
    onRefresh();
  };

  useEffect(() => {
    getEmissionSourceTree();
  }, [modelId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.floatButtonWrapper}>
        <Button type='primary' onClick={() => setApprovalConfigVisible(true)}>
          审批配置
        </Button>
      </div>
      <EmissionSourceTree
        treeData={treeData}
        hideTree={hideTree}
        onHideTree={() => {
          setHideTree(!hideTree);
        }}
        canHideTree
        onSelect={onSelect}
        selectedKeys={[]}
      />
      {/* 右侧主体内容 */}
      <div
        className={classNames(styles.collapseWrapper, {
          [styles.expandCollapseWrapper]: hideTree,
        })}
      >
        <TreeCollapseList
          loading={loading}
          treeData={treeData}
          onCollapseChange={collapseChange}
          isDetail={isDetail}
          renderChildren={(childrenItem, item) => {
            return (
              <>
                {!isDetail && (
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
                      await getEmissionSourceListByGhgClassify(
                        [item?.code, childrenItem?.code].toString(),
                      );
                    }}
                  >
                    {I18N.eca.fromEmissionSourceRepository}
                  </Button>
                )}
                {childrenItem?.emissionSourceList?.length && (
                  <ProTable
                    search={false}
                    size='small'
                    toolBarRender={false}
                    columns={sourceColumns(
                      isDetail,
                      onDelete,
                      onEdit,
                      onDetailClick,
                    )}
                    dataSource={childrenItem?.emissionSourceList}
                    rowKey='id'
                    scroll={{ y: 55 * 5 }}
                    pagination={false}
                  />
                )}
              </>
            );
          }}
        />
        {/* 排放源库弹窗 */}
        <ChooseEmissionSource
          loading={chooseEmissionSourceLoading}
          modelId={Number(modelId)}
          emissionSource={modalEmissionSource}
          visible={chooseEmissionSourceVisible}
          onCancel={() => {
            setChooseEmissionSourceVisible(false);
          }}
          onSaveSuccess={async (modelIdValue, selectedData, ghgClassify) => {
            await addAccountModelEmissionSourceApi({
              modelId: modelIdValue,
              emissionSourceCodeList: selectedData,
              ghgClassify,
            });
            Toast(
              'success',
              I18N.supplyChainCarbonManagement.operationSuccessful,
            );
            setChooseEmissionSourceVisible(false);
            onRefresh();
          }}
          currentGhgClassifyName={currentGhgClassifyName}
          onEmissionItemModalClick={id => {
            setEmissionSourceId(id);
            setEmissionSourceDetailVisible(true);
          }}
        />
        {/* 排放源查看详情数据 */}
        <EmissionSourceDetailDrawer
          visible={emissionSourceDetailVisible}
          onClose={() => {
            setEmissionSourceDetailVisible(false);
          }}
          emissionSourceId={Number(emissionSourceId)}
          actionType={PageTypeInfo.show}
        />
      </div>
      {/* 排放源抽屉 */}
      <AccountEmissionSourceDrawer
        visible={emissionSourceEditVisible}
        onClose={() => {
          setEmissionSourceEditVisible(false);
          onRefresh();
        }}
        propsEmissionSourceId={Number(emissionSourceId)}
        onSaveSuccess={() => {
          setEmissionSourceEditVisible(false);
          onRefresh();
        }}
      />

      {/* 审批配置弹窗 */}
      <ApprovalConfigModal
        isDetail={isDetail}
        modelId={modelId as string}
        open={approvalConfigVisible}
        onClose={() => {
          setApprovalConfigVisible(false);
        }}
      />
      {!drawerOptions?.isNoFooter && (
        <FormActions
          className='footWrapper'
          place='center'
          buttons={compact([
            !isDetail && {
              title:
                currentStep === ANALYSIS_STEP_TYPE.ANALYSIS_CONFIG
                  ? I18N.Factors.preserve
                  : I18N.Factors.saveNextStep,
              type: 'primary',
              loading: btnLoading,
              onClick: saveAnalysis,
              disabled: isAnalysisButtonDisabled,
            },
            {
              title: I18N.Factors.return,
              onClick: async () => {
                navigate(EcaRouteMaps.accountingModel);
              },
            },
          ])}
        />
      )}
    </div>
  );
};

export default AccountingModelInfo;
