/*
 * @@description:核算模型/排放源管理/选择排放源
 */

import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Cascader } from 'antd';
import { compact } from 'lodash-es';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  choseModelEmissionSourceListApi,
  emissionVerifyDeleteApi,
  getChoseEmissionSourceListApi,
  postEnumsApi,
  postUpdateStatusBatchApi,
} from '@/api/compution';
import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
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
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';

import {
  emissionSourceColumns,
  SearchSchema,
  TypeComputation,
} from './utils/columns';
import {
  culComputation,
  culFillDataComputation,
  isAccountingModel,
  isEmissionSource,
} from '../util/util';

const EmissionManage = () => {
  // 选择selectKey
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>({});
  const { pageTypeInfo, id, approvalId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    approvalId: string;
  }>();

  const { refresh, tableRef } = useTable();
  const navigate = useNavigate();

  // @ts-ignore
  const searchApi: CustomSearchProps<
    TypeComputation,
    SearchApiProps
  > = args => {
    const { ghg, iso } = args;
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
        ghg: ghg ? String(ghg) : undefined,
        iso: iso ? String(iso) : undefined,
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
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    const pageNum =
      new URLSearchParams(window.location.search).get('pageNum') || 1;
    setSelectedRowKeys({
      ...selectedRowKeys,
      [pageNum]: newSelectedRowKeys,
    });
  };
  const culMessionMageHistoryFn = () => {
    return window.location.pathname.indexOf('emissionManage') > -1;
  };
  const rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (newSelectedRowKeys: React.Key[]) => void;
    getCheckboxProps: (record: TypeComputation) => any;
  } = {
    selectedRowKeys: Object.values(selectedRowKeys).flat() as React.Key[],
    onChange: onSelectChange,
    getCheckboxProps: (record: TypeComputation) => ({
      disabled: culMessionMageHistoryFn() ? false : record.chooseIn === 1, // Column configuration not to be checked
    }),
  };

  return (
    <Page
      title={!pageTypeInfo && I18N.eca.emissionSourceRepository}
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.emissionManagInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChildArr={compact([
        !pageTypeInfo && {
          button: checkAuth(
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
        !pageTypeInfo && {
          button: (
            <div
              onClick={async () => {
                if (selectedRowKeys.length === 0) {
                  Toast('error', I18N.eca.pleaseSelectData2);

                  return;
                }
                modal.confirm({
                  content: I18N.eca.confirmEnable,
                  onOk: async () => {
                    await postUpdateStatusBatchApi({
                      idList: Object.values(
                        selectedRowKeys,
                      ).flat() as React.Key[],
                      status: 0,
                    });
                    refresh?.();
                    setSelectedRowKeys({});
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              }}
            >
              {I18N.eca.batchActivation}
            </div>
          ),
        },
        !pageTypeInfo && {
          button: (
            <div
              onClick={async () => {
                if (selectedRowKeys.length === 0) {
                  Toast('error', I18N.eca.pleaseSelectData2);

                  return;
                }
                modal.confirm({
                  content: I18N.eca.confirmDisabling,
                  onOk: async () => {
                    await postUpdateStatusBatchApi({
                      idList: Object.values(
                        selectedRowKeys,
                      ).flat() as React.Key[],
                      status: 1,
                    });
                    refresh?.();
                    setSelectedRowKeys({});
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              }}
            >
              {I18N.eca.batchDisabling}
            </div>
          ),
        },
        !pageTypeInfo && {
          button: (
            <div
              onClick={async () => {
                if (selectedRowKeys.length === 0) {
                  Toast('error', I18N.eca.pleaseSelectData2);
                  return;
                }
                await emissionVerifyDeleteApi({
                  idList: Object.values(selectedRowKeys).flat() as React.Key[],
                });
                modal.confirm({
                  content: I18N.eca.confirmDeletion,
                  onOk: async () => {
                    await postEnumsApi({
                      idList: Object.values(
                        selectedRowKeys,
                      ).flat() as React.Key[],
                    });
                    Toast('success', I18N.Factors.deleteSuccessful);
                    refresh?.();
                    setSelectedRowKeys({});
                  },
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                });
              }}
            >
              {I18N.eca.batchDeletion}
            </div>
          ),
        },
      ])}
      wrapperClass='marginBottomFormActionsHeight'
    >
      <CustomTableRender<TypeComputation, SearchApiProps>
        tableRef={tableRef}
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          widgets: { cascader: Cascader },
          searchOnMount: false,
        }}
        tableProps={{
          columns: emissionSourceColumns({
            refresh,
            navigate,
            pageTypeInfo,
            modelId: id,
            approvalId,
          }),
          rowSelection,
          scroll: { x: 1200 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      {window.location.pathname !== '/carbonAccounting/emissionManage' && (
        <FormActions
          place='center'
          buttons={compact([
            {
              title: I18N.Factors.preserve,
              type: 'primary',
              disabled:
                (Object.values(selectedRowKeys).flat() as React.Key[])
                  .length === 0,
              onClick: async () => {
                // 判断是否事 核算模型  还是碳排放核算 的排放源
                if (!culComputation()) {
                  if (culFillDataComputation()) {
                    /** 排放核算 */
                    await postComputationComputationEmissionSourceAdd({
                      req: {
                        emissionSourceIds: (
                          Object.values(selectedRowKeys).flat() as React.Key[]
                        ).toString(),
                        id: id ? Number(id) : 0,
                      },
                    }).then(() => {
                      navigate(
                        virtualLinkTransform(
                          EcaRouteMaps.fillDataInfo,
                          [PAGE_TYPE_VAR, ':id', ':approvalId'],
                          [pageTypeInfo, id, approvalId],
                        ),
                      );
                    });
                    return;
                  }
                  /** 核算模型 */
                  await postComputationModelEmissionSourceAdd({
                    req: {
                      emissionSourceIds: (
                        Object.values(selectedRowKeys).flat() as React.Key[]
                      ).toString(),
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
                      emissionSourceIds: (
                        Object.values(selectedRowKeys).flat() as React.Key[]
                      ).toString(),
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
                        [PAGE_TYPE_VAR, ':id', ':approvalId'],
                        [pageTypeInfo, id, approvalId],
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
    </Page>
  );
};

export default EmissionManage;
