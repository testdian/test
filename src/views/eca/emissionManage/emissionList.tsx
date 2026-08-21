/*
 * @@description:碳排放源
 */

import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { Key, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  choseModelEmissionSourceListApi,
  getChoseEmissionSourceListApi,
} from '@/api/compution';
import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { useOrgTreeData } from '@/hooks/useOrgTreeData';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getComputationEmissionSourcePage,
  postComputationComputationEmissionSourceAdd,
  postComputationModelEmissionSourceAdd,
  getComputationEmissionSourcePageProps as SearchApiProps,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import BatchUpdateFactorModal from '@/views/eca/component/BatchUpdateFactorModal';

import styles from './index.module.less';
import { getEmissionSourceTreeApi } from './service';
import { EmissionSourceTreeType } from './type';
import { useAccountYearList } from '../hooks';
import {
  emissionSourceColumns,
  ListSearchSchema,
  TypeComputation,
} from './utils/columns';
import { AccountModelInfoTreeDatum } from '../accountingModel/Info/type';
import EmissionSourceTree from '../component/TreePanel';
import {
  culComputation,
  culFillDataComputation,
  isAccountingModel,
  isEmissionSource,
} from '../util/util';
import ManualSyncModal from './component/ManualSyncModal';

const EmissionManage = () => {
  const [orgTreeData] = useOrgTreeData();

  const yearArr = useAccountYearList()?.map(item => ({
    label: item.year,
    value: item.year,
  }));

  /** 是否收起左侧 tree */
  const [hideTree, setHideTree] = useState(false);
  /** 排放源库 - 菜单接口返回值 */
  const [emissionTree, setEmissionTree] = useState<EmissionSourceTreeType[]>(
    [],
  );
  // 选择selectKey
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const { refresh, tableRef } = useTable();
  const navigate = useNavigate();
  /** 排放源树key值 */
  const [emissionTreeKey, setEmissionTreeKey] = useState<string>('');
  /** 选中的树节点keys */
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  // @ts-ignore
  const searchApi: CustomSearchProps<
    TypeComputation,
    SearchApiProps
  > = args => {
    const { ghg: searchGhg, iso } = args;
    const ghg = searchGhg || emissionTreeKey;

    // 核算模型
    if (isAccountingModel()) {
      return choseModelEmissionSourceListApi({
        ...args,
        ghg: ghg ? String(ghg) : undefined,
        iso: iso ? String(iso) : undefined,
        modelId: id || '0',
      }).then(({ data }) => {
        return data?.data || [];
      });
    }
    // 碳排放核算
    if (isEmissionSource()) {
      // 如果是核算模型

      return getComputationEmissionSourcePage({
        ...args,
        ghg: ghg ? emissionTreeKey : undefined,
      }).then(({ data }) => {
        return data?.data || [];
      });
    }
    return getChoseEmissionSourceListApi({
      ...args,
      ghg: ghg ? String(ghg) : undefined,
      iso: iso ? String(iso) : undefined,
      computationId: id || '',
    }).then(({ data }) => {
      return data?.data || [];
    });
  };

  // 手动同步弹窗状态
  const [manualSyncVisible, setManualSyncVisible] = useState(false);
  const [batchUpdateFactorVisible, setBatchUpdateFactorVisible] =
    useState(false);
  const [currentEmissionSourceId, setCurrentEmissionSourceId] = useState<
    number | undefined
  >();

  // 打开手动同步弹窗
  const openManualSyncModal = (emissionSourceId: number) => {
    setCurrentEmissionSourceId(emissionSourceId);
    setManualSyncVisible(true);
  };

  /** =================批量删除相关====================== */
  // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };
  // const culMessionMageHistoryFn = () => {
  //   return window.location.pathname.indexOf('emissionManage') > -1;
  // };
  // const rowSelection: {
  //   selectedRowKeys: React.Key[];
  //   onChange: (newSelectedRowKeys: React.Key[]) => void;
  //   getCheckboxProps: (record: TypeComputation) => any;
  //   preserveSelectedRowKeys: boolean;
  // } = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  //   getCheckboxProps: (record: TypeComputation) => ({
  //     disabled: culMessionMageHistoryFn() ? false : record.chooseIn === 1, // Column configuration not to be checked
  //   }),
  //   preserveSelectedRowKeys: true,
  // };
  // const sigleDelFn = (record: any) => {
  //   setSingleVisAble(true);
  //   setRecord({ ...record });
  // };
  /** =================批量删除相关====================== */

  /** 获取排放源树 */
  const getEmissionSourceTree = async () => {
    const { data } = await getEmissionSourceTreeApi();
    setEmissionTree(data?.data || []);
  };

  useEffect(() => {
    getEmissionSourceTree();
  }, []);

  useEffect(() => {
    tableRef.current?.doSearch({}, { ghg: emissionTreeKey });
  }, [emissionTreeKey]);

  return (
    <Page
      title={!pageTypeInfo && I18N.eca.emissionSourceRepository}
      actionBtnChildArr={[
        {
          button:
            !pageTypeInfo &&
            checkAuth(
              '/emissionManagInfo/add',
              <div
                onClick={async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.add, 0],
                    ),
                  );
                }}
              >
                <PlusOutlined /> {I18N.Factors.newAddition}
              </div>,
            ),
        },
        {
          button:
            !pageTypeInfo &&
            checkAuth(
              '/emissionManagInfo/batchUpdateFactor',
              <div onClick={() => setBatchUpdateFactorVisible(true)}>
                批量更新因子
              </div>,
            ),
        },
        // {
        //   button:
        //     !pageTypeInfo &&
        //     checkAuth(
        //       '/emissionManagInfo/allAble',
        //       <div
        //         onClick={async () => {
        //           if (selectedRowKeys.length === 0) {
        //             Toast('error', I18N.eca.pleaseSelectData2);

        //             return;
        //           }
        //           modal.confirm({
        //             content: I18N.eca.confirmEnable,
        //             onOk: async () => {
        //               await postUpdateStatusBatchApi({
        //                 idList: selectedRowKeys,
        //                 status: 0,
        //               });
        //               refresh?.();
        //               setSelectedRowKeys([]);
        //             },
        //             okText: I18N.base.confirm,
        //             cancelText: I18N.Factors.cancel,
        //           });
        //         }}
        //       >
        //         {I18N.eca.batchActivation}
        //       </div>,
        //     ),
        // },
        // {
        //   button:
        //     !pageTypeInfo &&
        //     checkAuth(
        //       '/emissionManagInfo/allDisAble',
        //       <div
        //         onClick={async () => {
        //           if (selectedRowKeys.length === 0) {
        //             Toast('error', I18N.eca.pleaseSelectData2);

        //             return;
        //           }
        //           modal.confirm({
        //             content: I18N.eca.confirmDisabling,
        //             onOk: async () => {
        //               await postUpdateStatusBatchApi({
        //                 idList: selectedRowKeys,
        //                 status: 1,
        //               });
        //               refresh?.();
        //               setSelectedRowKeys([]);
        //             },
        //             okText: I18N.base.confirm,
        //             cancelText: I18N.Factors.cancel,
        //           });
        //         }}
        //       >
        //         {I18N.eca.batchDisabling}
        //       </div>,
        //     ),
        // },
        // {
        //   button:
        //     !pageTypeInfo &&
        //     checkAuth(
        //       '/emissionManagInfo/allDel',
        //       <div
        //         onClick={async () => {
        //           if (selectedRowKeys.length === 0) {
        //             Toast('error', I18N.eca.pleaseSelectData2);
        //             return;
        //           }
        //           await emissionVerifyDeleteApi({
        //             idList: selectedRowKeys,
        //           });
        //           setMoreVisAble(true);
        //           // modal.confirm({
        //           //   content: I18N.eca.confirmDeletion,
        //           //   onOk: async () => {
        //           //   await postEnumsApi({
        //           //     idList: selectedRowKeys,
        //           //   });
        //           //   Toast('success', I18N.Factors.deleteSuccessful);
        //           //   refresh?.();
        //           //   setSelectedRowKeys([]);
        //           // },
        //           //   okText: I18N.base.confirm,
        //           //   cancelText: I18N.Factors.cancel,
        //           // });
        //         }}
        //       >
        //         {I18N.eca.batchDeletion}
        //       </div>,
        //     ),
        // },
      ]}
    >
      {/* 左右布局左侧tree，可以收起，右侧表格 */}
      <div className={styles.treeWrapperMain}>
        <div className={styles.treeWrapperLeft}>
          <EmissionSourceTree
            treeData={emissionTree as unknown as AccountModelInfoTreeDatum[]}
            hideTree={hideTree}
            canHideTree
            onSelect={(selectedKey: Key[]) => {
              setEmissionTreeKey(selectedKey.toString());
              setSelectedKeys(selectedKey);
            }}
            onHideTree={() => {
              setHideTree(!hideTree);
            }}
            selectedKeys={selectedKeys}
          />
        </div>
        <div
          className={classNames(styles.treeSourceTable, {
            [styles.expandCollapseWrapper]: hideTree,
          })}
        >
          <CustomTableRender<TypeComputation, SearchApiProps>
            tableRef={tableRef}
            searchProps={{
              schema: ListSearchSchema({ orgTreeData }),
              api: searchApi,
              searchOnMount: false,
            }}
            tableProps={{
              columns: emissionSourceColumns({
                refresh,
                navigate,
                pageTypeInfo,
                modelId: id,
                yearArr,
                openManualSyncModal,
              }),
            }}
            autoSaveSearchInfo
            autoAddIndexColumn
            autoFixNoText
          />
        </div>
      </div>

      {window.location.pathname !== '/accountingAllocation/emissionManage' && (
        <FormActions
          place='center'
          buttons={compact([
            {
              title: I18N.Factors.preserve,
              type: 'primary',
              // disabled: selectedRowKeys.length === 0,
              onClick: async () => {
                // 判断是否事 核算模型  还是碳排放核算 的排放源
                if (!culComputation()) {
                  if (culFillDataComputation()) {
                    /** 排放核算 */
                    await postComputationComputationEmissionSourceAdd({
                      req: {
                        // emissionSourceIds: selectedRowKeys.toString(),
                        id: id ? Number(id) : 0,
                      },
                    }).then(() => {
                      navigate(
                        virtualLinkTransform(
                          EcaRouteMaps.fillDataInfo,
                          [PAGE_TYPE_VAR, ':id'],
                          [pageTypeInfo, id],
                        ),
                      );
                    });
                    return;
                  }
                  /** 核算模型 */
                  await postComputationModelEmissionSourceAdd({
                    req: {
                      // emissionSourceIds: selectedRowKeys.toString(),
                      id: id ? Number(id) : 0,
                    },
                  }).then(() => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSource,
                        [PAGE_TYPE_VAR, ':id'],
                        [pageTypeInfo, id],
                      ),
                    );
                  });
                } else {
                  /** 排放核算 */
                  await postComputationComputationEmissionSourceAdd({
                    req: {
                      // emissionSourceIds: selectedRowKeys.toString(),
                      id: id ? Number(id) : 0,
                    },
                  }).then(() => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [pageTypeInfo, id],
                      ),
                    );
                  });
                }
              },
            },
            {
              title: I18N.Factors.cancel,
              onClick: async () => {
                if (!culComputation()) {
                  if (culFillDataComputation()) {
                    /** 排放核算 */

                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.fillDataInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [pageTypeInfo, id],
                      ),
                    );
                    return;
                  }
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.accountingModelEmissionSource,
                      [PAGE_TYPE_VAR, ':id'],
                      [pageTypeInfo, id],
                    ),
                  );
                  return;
                }
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.carbonMissionAccountingSourceInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [pageTypeInfo, id],
                  ),
                );
              },
            },
          ])}
        />
      )}
      {/* 批量删除排放源 */}
      {/* <DelMoreEmissionSouuceModel
        open={moreVisAble}
        onOk={async () => {
          await postEnumsApi({
            idList: selectedRowKeys,
          });
          Toast('success', I18N.Factors.deleteSuccessful);
          refresh?.();
          setSelectedRowKeys([]);
          setMoreVisAble(false);
        }}
        onCancel={() => {
          setMoreVisAble(false);
        }}
      /> */}

      {/* 手动同步弹窗 */}
      <ManualSyncModal
        visible={manualSyncVisible}
        emissionSourceId={currentEmissionSourceId}
        yearArr={yearArr}
        onClose={() => {
          setManualSyncVisible(false);
          setCurrentEmissionSourceId(undefined);
        }}
        onSuccess={() => {
          refresh();
        }}
      />
      <BatchUpdateFactorModal
        open={batchUpdateFactorVisible}
        scene='emissionManage'
        onCancel={() => {
          setBatchUpdateFactorVisible(false);
        }}
        onSuccess={() => {
          setBatchUpdateFactorVisible(false);
          refresh?.();
        }}
      />
    </Page>
  );
};

export default EmissionManage;
