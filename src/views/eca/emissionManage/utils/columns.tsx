/*
 * @@description:
 */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Input, InputNumber, Select, Tooltip } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { compact, isNull } from 'lodash-es';
import { Key, useContext } from 'react';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import {
  postDeleteEmissionSourceApi,
  postUpdateStatusApi,
} from '@/api/compution';
import { ActivityItem, DataItem } from '@/api/type';
import { CustomTag, emissionDataColor } from '@/components/CustomTag';
import { LocaleContext } from '@/components/LocaleProvider';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Computation,
  EnumResp,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  postComputationComputationEmissionSourceDelete,
  postComputationEmissionSourceDelete,
  postComputationModelEmissionSourceDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { FistComputationEnums } from '../../hooks';
import { OrgTree } from '../../hooks/useOrgTree/type';
import { culComputation } from '../../util/util';
import {
  copyEmissionSourceApi,
  syncEmissionSourceApi,
  syncEmissionSourceCheckApi,
} from '../service';

export type TypeComputation = Computation & {
  ghgCategory_name?: string;
  sourceName?: string;
  isoCategory_name?: string;
  id?: string;
  emissionStatus?: number;
  emissionSourceName?: string;
  chooseIn: number;
};
const returnCommelete = (): TableRenderProps<TypeComputation>['columns'] => {
  return compact([
    {
      title: I18N.eca.emissionSourceName,
      dataIndex: 'sourceName',
      width: 160,
      fixed: 'left',
      // copyable: true,
    },
    {
      title: I18N.eca.emissionFacilityActivity,
      dataIndex: 'facility',
      width: 190,
    },
    {
      title: I18N.eca.activityDataSheet,
      dataIndex: 'activityUnitName',
      width: 120,
    },
    {
      title: I18N.Factors.emissionFactors,
      dataIndex: 'factorDesc',
      width: 160,
    },
    {
      title: I18N.eca.ghgClassification,
      dataIndex: 'ghgClassify_name',
      width: 120,

      render: (text: string, record) => {
        return `${record?.ghgCategory_name},${text}`;
      },
    },
    {
      title: I18N.eca.isoClassification,
      dataIndex: 'isoClassify_name',
      width: 120,

      render: (text: string, record) => {
        return `${record?.isoCategory_name},${text}`;
      },
    },
    {
      title: I18N.eca.emissionSourceId,
      dataIndex: 'sourceCode',
      width: 160,
    },
  ]);
};
const returnListCommelete =
  (): TableRenderProps<TypeComputation>['columns'] => {
    return compact([
      {
        title: I18N.eca.emissionSourceName,
        dataIndex: 'sourceName',
        width: 120,
        // fixed: 'left',
        // copyable: true,
      },
      // {
      //   title: I18N.eca.emissionFacilityActivity,
      //   dataIndex: 'facility',
      //   width: 190,
      // },
      // {
      //   title: I18N.eca.activityDataSheet,
      //   dataIndex: 'activityUnitName',
      //   width: 120,
      // },
      {
        title: I18N.eca.ghgClassification,
        dataIndex: 'ghgClassify_name',
        width: 200,
        render: (text: string, record) => {
          return `${record?.ghgCategory_name},${text}`;
        },
      },
      // {
      //   title: I18N.eca.isoClassification,
      //   dataIndex: 'isoClassify_name',
      //   width: 120,

      //   render: (text: string, record) => {
      //     return `${record?.isoCategory_name},${text}`;
      //   },
      // },
      // {
      //   title: I18N.eca.emissionSourceId,
      //   dataIndex: 'sourceCode',
      //   width: 160,
      // },
    ]);
  };
// 排放源
export const columns = ({
  refresh,
  navigate,
  pageTypeInfo = undefined,
  modelId,
  approvalId,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  pageTypeInfo?: PageTypeInfo;
  modelId?: string;
  approvalId?: string;
}): TableRenderProps<TypeComputation>['columns'] =>
  compact([
    ...returnCommelete(),
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: I18N.Factors.state,
      dataIndex: 'emissionStatus_name',
      width: 160,
      render: (value: any, record: any) => {
        console.log(record.emissionStatus, 'record.emissionStatus');
        return (
          <CustomTag
            color={
              emissionDataColor[
                Number(
                  record.emissionStatus,
                ) as unknown as keyof typeof emissionDataColor
              ]
            }
            text={value || '-'}
          />
        );
      },
    },
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
      width: 160,
    },
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: I18N.Factors.operation,
      width: pageTypeInfo ? 90 : 280,
      dataIndex: 'id',
      render(id: number, record: any) {
        return (
          <TableActions
            menus={compact([
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/Edit', {
                  label: I18N.Factors.edit,
                  key: I18N.Factors.edit,
                  onClick: async () => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.emissionManagInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.edit, id],
                      ),
                    );
                  },
                }),
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/Edit', {
                  label:
                    Number(record?.emissionStatus) === 0
                      ? I18N.Factors.disabled
                      : I18N.Factors.enable,
                  key: I18N.Factors.edit,
                  onClick: async () => {
                    modal.confirm({
                      content:
                        Number(record?.emissionStatus) === 0
                          ? I18N.template(I18N.eca.confirmDisablingThis2, {
                              val1: record?.sourceName,
                            })
                          : I18N.template(I18N.eca.confirmDisablingThis, {
                              val1: record?.sourceName,
                            }),
                      onOk: async () => {
                        if (Number(record?.emissionStatus) === 0) {
                          await postUpdateStatusApi({
                            id: id as unknown as Key[],
                            status: 1,
                          });
                        } else {
                          await postUpdateStatusApi({
                            id: id as unknown as Key[],
                            status: 0,
                          });
                        }
                        refresh?.();
                      },
                      okText: I18N.utils.ok,
                      cancelText: I18N.Factors.cancel,
                    });
                  },
                }),
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/copy', {
                  label: I18N.carbonFootPrintLCA.copy,
                  key: I18N.carbonFootPrintLCA.copy,
                  onClick: async () => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.emissionManagInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        ['copy', id],
                      ),
                    );
                  },
                }),
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/delete', {
                  label: I18N.Factors.delete,
                  key: I18N.Factors.delete,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: (
                        <span>
                          {I18N.eca.confirmDeletionOfThis8}
                          <span className='modal_text'>
                            {record?.sourceName}?
                          </span>
                        </span>
                      ),
                      onOk: () => {
                        return postComputationEmissionSourceDelete({
                          req: { id },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', I18N.Factors.deleteSuccessful);
                            refresh?.();
                          }
                        });
                      },
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                    });
                  },
                }),

              checkAuth('/emissionManagInfo/show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  // 新增排放源查看
                  // 填报数据 - 排放源管理= 查看
                  if (window.location.pathname.indexOf('/fillData') > -1) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.fillDataAccountingSourceInfoDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                          ':approvalId',
                        ],
                        [
                          pageTypeInfo,
                          PageTypeInfo.show,
                          id,
                          modelId,
                          approvalId,
                        ],
                      ),
                    );
                    return;
                  }
                  if (
                    window.location.pathname.indexOf(
                      '/carbonAccounting/carbonMissionAccounting/emissionSource/add/',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 碳排放核算 = 排放源管理= 查看
                  if (
                    window.location.pathname.indexOf(
                      '/carbonMissionAccounting',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfoDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }

                  // 如果是核算模型-排放源管理 - 排放源详情
                  if (
                    window.location.pathname.indexOf('/accountingModel') > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 排放源-查看详情
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
            ])}
          />
        );
      },
    },
  ]);

/** 排放源库表头 */
export const emissionSourceColumns = ({
  refresh,
  navigate,
  pageTypeInfo = undefined,
  modelId,
  approvalId,
  yearArr,
  openManualSyncModal,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  pageTypeInfo?: PageTypeInfo;
  modelId?: string;
  approvalId?: string;
  sigleDelFn?: (record: any) => void;
  yearArr?: { label: string | number; value: string | number }[];
  openManualSyncModal?: (emissionSourceId: number) => void;
}): TableRenderProps<TypeComputation>['columns'] =>
  compact([
    ...returnListCommelete(),
    // window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
    //   title: I18N.Factors.state,
    //   dataIndex: 'emissionStatus_name',
    //   width: 160,
    //   render: (value: any, record: any) => {
    //     return (
    //       <CustomTag
    //         color={
    //           emissionDataColor[
    //             Number(
    //               record.emissionStatus,
    //             ) as unknown as keyof typeof emissionDataColor
    //           ]
    //         }
    //         text={value || '-'}
    //       />
    //     );
    //   },
    // },
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: '所属组织',
      dataIndex: 'orgName',
      width: 120,
    },
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
      width: 120,
    },
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: I18N.Factors.operation,
      width: pageTypeInfo ? 90 : 200,
      dataIndex: 'id',
      render(id: number, record: any) {
        return (
          <TableActions
            menus={compact([
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/Edit', {
                  label: I18N.Factors.edit,
                  key: I18N.Factors.edit,
                  onClick: async () => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.emissionManagInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.edit, id],
                      ),
                    );
                  },
                }),
              !pageTypeInfo &&
                yearArr &&
                yearArr?.length > 0 &&
                checkAuth('/emissionManagInfo/Edit', {
                  label: 'ID同步',
                  key: 'ID同步',
                  onClick: async () => {
                    let selectedYears: number;
                    const yearOptions = yearArr || [];

                    modal.confirm({
                      title: '请选择同步该排放源到哪一年？',
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: (
                        <div style={{ marginBottom: 24, marginTop: 24 }}>
                          <Select
                            // mode='multiple'
                            style={{ width: '100%' }}
                            placeholder='请选择年份'
                            allowClear
                            showSearch
                            options={yearOptions}
                            onChange={values => {
                              selectedYears = values;
                            }}
                          />
                        </div>
                      ),
                      onOk: async () => {
                        if (!selectedYears) {
                          Toast('error', '请选择年份');
                          return Promise.reject();
                        }

                        // 先调用校验接口
                        const checkResult = await syncEmissionSourceCheckApi({
                          id,
                          year: selectedYears,
                        });

                        // 需要同步
                        const needAsync =
                          checkResult?.data?.data &&
                          checkResult?.data?.data !== '0';

                        // 如果有校验信息，显示二次确认弹窗
                        if (needAsync) {
                          return new Promise((resolve, reject) => {
                            modal.confirm({
                              title: '提示',
                              content: checkResult.data.data,
                              onOk: async () => {
                                try {
                                  const { data } = await syncEmissionSourceApi({
                                    id,
                                    year: selectedYears,
                                  });
                                  if (data.data) {
                                    Toast('success', '已完成同步');
                                  }
                                  resolve(true);
                                } catch (error) {
                                  reject(error);
                                }
                              },
                              onCancel: () => {
                                reject(new Error('取消同步'));
                              },
                              okText: '确认',
                              cancelText: '取消',
                            });
                          });
                        }

                        // 如果没有校验信息，提示
                        Toast(
                          'success',
                          '核算和模型中均不存在此排放源，无需同步。',
                        );
                        return Promise.resolve();
                      },
                      okText: '确定',
                      cancelText: '取消',
                    });
                  },
                }),
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/Edit', {
                  label: '手动同步',
                  key: '手动同步',
                  onClick: async () => {
                    // 打开手动同步弹窗
                    openManualSyncModal?.(id);
                  },
                }),
              // !pageTypeInfo &&
              //   checkAuth('/emissionManagInfo/Edit', {
              //     label:
              //       Number(record?.emissionStatus) === 0
              //         ? I18N.Factors.disabled
              //         : I18N.Factors.enable,
              //     key: I18N.Factors.edit,
              //     onClick: async () => {
              //       modal.confirm({
              //         content:
              //           Number(record?.emissionStatus) === 0
              //             ? I18N.template(I18N.eca.confirmDisablingThis2, {
              //                 val1: record?.sourceName,
              //               })
              //             : I18N.template(I18N.eca.confirmDisablingThis, {
              //                 val1: record?.sourceName,
              //               }),
              //         onOk: async () => {
              //           if (Number(record?.emissionStatus) === 0) {
              //             await postUpdateStatusApi({
              //               id: id as unknown as Key[],
              //               status: 1,
              //             });
              //           } else {
              //             await postUpdateStatusApi({
              //               id: id as unknown as Key[],
              //               status: 0,
              //             });
              //           }
              //           refresh?.();
              //         },
              //         cancelText: I18N.Factors.cancel,
              //         okText: I18N.utils.ok,
              //       });
              //     },
              //   }),
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/copy', {
                  label: I18N.carbonFootPrintLCA.copy,
                  key: I18N.carbonFootPrintLCA.copy,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: <span>{I18N.eca.confirmToCopyThis}</span>,
                      onOk: () => {
                        return copyEmissionSourceApi({ id: record.id }).then(
                          ({ data }) => {
                            if (data.code === 200) {
                              Toast(
                                'success',
                                I18N.carbonFootPrintLCA.copySuccessful,
                              );
                              refresh?.();
                            }
                          },
                        );
                      },
                      cancelText: I18N.Factors.cancel,
                      okText: I18N.utils.ok,
                    });
                  },
                }),
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/delete', {
                  label: I18N.Factors.delete,
                  key: I18N.Factors.delete,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: (
                        <span>
                          {I18N.eca.confirmDeletionOfThis}
                          <span className='modal_text'>
                            {record?.sourceName}?
                          </span>
                        </span>
                      ),
                      onOk: () => {
                        return postComputationEmissionSourceDelete({
                          req: { id },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', I18N.Factors.deleteSuccessful);
                            refresh?.();
                          }
                        });
                      },
                      cancelText: I18N.Factors.cancel,
                      okText: I18N.utils.ok,
                    });
                  },
                }),

              checkAuth('/emissionManagInfo/show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  // 新增排放源查看
                  // 填报数据 - 排放源管理= 查看
                  if (window.location.pathname.indexOf('/fillData') > -1) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.fillDataAccountingSourceInfoDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                          ':approvalId',
                        ],
                        [
                          pageTypeInfo,
                          PageTypeInfo.show,
                          id,
                          modelId,
                          approvalId,
                        ],
                      ),
                    );
                    return;
                  }
                  if (
                    window.location.pathname.indexOf(
                      '/carbonAccounting/carbonMissionAccounting/emissionSource/add/',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 碳排放核算 = 排放源管理= 查看
                  if (
                    window.location.pathname.indexOf(
                      '/carbonMissionAccounting',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfoDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }

                  // 如果是核算模型-排放源管理 - 排放源详情
                  if (
                    window.location.pathname.indexOf('/accountingModel') > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 排放源-查看详情
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
            ])}
          />
        );
      },
    },
  ]);
// 核算模型- 排放源管理 碳排放核算-排放源管理
export const meissionSourceColumns = ({
  refresh,
  navigate,
  modelId,
  nodel,
  pageTypeInfo,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  modelId?: string;
  nodel?: boolean;
  pageTypeInfo?: string;
}): TableRenderProps<TypeComputation>['columns'] => {
  return [
    ...returnListCommelete(),

    {
      title: I18N.Factors.operation,
      width: 120,
      dataIndex: 'id',
      render(id: string, record) {
        // carbonAccounting/carbonMissionAccounting/emissionSource/add/
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/role/detail', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  // carbonAccounting/carbonMissionAccounting/emissionSource/add/43/chooseEmissionSource/0
                  if (
                    window.location.pathname.indexOf(
                      'carbonAccounting/carbonMissionAccounting/emissionSource',
                    ) >= 0
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 碳排放核算 = 详情= 查看
                  if (
                    window.location.pathname.indexOf(
                      '/carbonMissionAccounting',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfoDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 如果是核算模型-排放源管理 - 排放源详情
                  if (
                    window.location.pathname.indexOf('/accountingModel') > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }

                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
              !nodel &&
                checkAuth('/sys/role/del', {
                  label: I18N.Factors.delete,
                  key: I18N.Factors.delete,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: (
                        <span>
                          {I18N.eca.confirmDeletionOfThis8}
                          <span>{record?.sourceName}？</span>
                        </span>
                      ),
                      onOk: () => {
                        if (culComputation()) {
                          return postComputationComputationEmissionSourceDelete(
                            {
                              req: {
                                emissionSourceIds: id,
                                id: Number(modelId),
                                delType: 2,
                              },
                            },
                          ).then(({ data }) => {
                            if (data.code === 200) {
                              Toast('success', I18N.Factors.deleteSuccessful);
                              refresh?.();
                            }
                          });
                        }
                        return postComputationModelEmissionSourceDelete({
                          req: {
                            emissionSourceIds: id,
                            id: Number(modelId),
                          },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', I18N.Factors.deleteSuccessful);
                            refresh?.();
                          }
                        });
                      },
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                    });
                  },
                }),
            ])}
          />
        );
      },
    },
  ];
};

// 碳排放核算- 核算详情 - 排放源列表
export const carbonMissionShowColumns = ({
  refresh,
  navigate,
  modelId,
  pageTypeInfo,
  leftIndex,
  currentKey,
  isFillData,
  dataId,
  isDetail,
  dataSource,
  setDataSource,
  changeDataSourceFn,
  HFCsEnumArr,
  PFCseNUMArr,
  auditStatus,
  approvalId,
  delFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  modelId?: string;
  nodel?: boolean;
  pageTypeInfo?: string;
  leftIndex?: string;
  currentKey?: string;
  isFillData?: boolean;
  dataId?: string;
  isDetail?: boolean;
  dataSource?: DataItem[];
  setDataSource?: (data: DataItem[]) => void;
  changeDataSourceFn?: (data: DataItem[]) => void;
  HFCsEnumArr?: DefaultOptionType[];
  PFCseNUMArr?: DefaultOptionType[];
  auditStatus?: string;
  approvalId?: string;
  delFn?: () => void;
  addFn?: (record: any) => void;
  children?: any[];
}): TableRenderProps<any>['columns'] => {
  const splitCurrentKey = currentKey?.split('-')[1];
  const oprateObj = {
    title: I18N.Factors.operation,
    width: 140,
    dataIndex: 'id',
    render(id: string, record: any) {
      const culDelFn = () => {
        if (
          window.location.pathname.indexOf('certificationReviewCenter') >= 0
        ) {
          return false;
        }
        if (window.location.pathname.indexOf('approvalManage') >= 0) {
          return false;
        }
        if (Number(splitCurrentKey) === 0 && pageTypeInfo === 'edit') {
          return true;
        }
        if (Number(splitCurrentKey) === 1 && pageTypeInfo === 'edit') {
          return true;
        }
        if (Number(splitCurrentKey) === 2 && pageTypeInfo === 'edit') {
          return true;
        }
        if (Number(splitCurrentKey) === 3 && pageTypeInfo === 'edit') {
          return true;
        }
        if (Number(splitCurrentKey) === 4 && pageTypeInfo === 'edit') {
          return true;
        }

        return false;
      };
      // const culAddFn = () => {
      //   if (Number(splitCurrentKey) === 3 && pageTypeInfo === 'edit') {
      //     return true;
      //   }
      //   if (Number(splitCurrentKey) === 4 && pageTypeInfo === 'edit') {
      //     return true;
      //   }
      //   return false;
      // };
      return (
        <TableActions
          menus={compact([
            // culAddFn() && {
            //   label: I18N.carbonAccount.add,
            //   key: I18N.carbonAccount.add,
            //   onClick: async () => {
            //     addFn?.(record);
            //   },
            // },
            {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                if (
                  window.location.pathname.indexOf(
                    'carbonAccounting/carbonMissionAccounting/emissionSource',
                  ) >= 0
                ) {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                      [
                        PAGE_TYPE_VAR,
                        ':factorPageInfo',
                        ':SourcefactorId',
                        ':id',
                      ],
                      [pageTypeInfo, PageTypeInfo.show, id, modelId],
                    ),
                  );
                  return;
                }
                // 碳排放核算 = 详情= 查看
                if (
                  window.location.pathname.indexOf('/carbonMissionAccounting') >
                  -1
                ) {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.carbonMissionAccountingInfoEmissionSourceInfo,
                      [
                        PAGE_TYPE_VAR,
                        ':factorPageInfo',
                        ':sourcefactorId',
                        ':id',
                        ':computationDataId',
                      ],
                      [
                        pageTypeInfo,
                        PageTypeInfo.show,
                        record.emissionSourceId,
                        modelId,
                        leftIndex,
                      ],
                    ),
                  );
                  return;
                }
                // 如果是核算模型-排放源管理 - 排放源详情
                if (window.location.pathname.indexOf('/accountingModel') > -1) {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                      [
                        PAGE_TYPE_VAR,
                        ':factorPageInfo',
                        ':SourcefactorId',
                        ':id',
                      ],
                      [pageTypeInfo, PageTypeInfo.show, id, modelId],
                    ),
                  );
                  return;
                }
                /**
                 * TODO - 排放数据审核
                 * */
                if (window.location.pathname.indexOf('/approvalManage') > -1) {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.approvalManageInfoSourceDetail,
                      [
                        PAGE_TYPE_VAR,
                        ':factorPageInfo',
                        ':SourcefactorId',
                        ':dataId',
                        ':auditStatus',
                        ':id',
                      ],
                      [
                        pageTypeInfo,
                        PageTypeInfo.show,
                        record.emissionSourceId,
                        dataId,
                        auditStatus,
                        modelId,
                        PageTypeInfo.show,
                        record.emissionSourceId,
                        record.emissionSourceId,
                      ],
                    ),
                  );
                  return;
                }
                if (isFillData) {
                  const path = virtualLinkTransform(
                    EcaRouteMaps.fillDataInfoScreen,
                    [
                      PAGE_TYPE_VAR,
                      ':id',
                      ':sourcePageInfo',
                      ':SourcefactorId',
                      ':approvalId',
                    ],
                    [
                      pageTypeInfo,
                      modelId,
                      PageTypeInfo.show,
                      record.emissionSourceId,
                      approvalId,
                    ],
                  );
                  if (Number(splitCurrentKey) < 3) {
                    navigate(path);
                  } else {
                    navigate(
                      `${path}?computationDataSourceId=${record?.computationDataSourceId}`,
                    );
                  }

                  return;
                }

                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.emissionManagInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            },
            culDelFn() &&
              checkAuth('/fillDataInfo/delMessionsource', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    content: (
                      <span>
                        {I18N.eca.confirmDeletionOfThis8}
                        <span>{record?.sourceName}？</span>
                        {I18N.eca.operateirreversible}
                      </span>
                    ),
                    onOk: () => {
                      if (culComputation()) {
                        return postComputationComputationEmissionSourceDelete({
                          req: {
                            emissionSourceIds: id,
                            id: Number(modelId),
                          },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', I18N.Factors.deleteSuccessful);
                            refresh?.();
                          }
                        });
                      }
                      return postDeleteEmissionSourceApi({
                        emissionSourceIds: record?.emissionSourceId,
                        id: `${modelId || 0}`,
                        delType: 2,
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', I18N.Factors.deleteSuccessful);
                          refresh?.();
                          delFn?.();
                        }
                      });
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              }),
          ])}
        />
      );
    },
  };

  // const onBlurFn = (e: any, record: ActivityItem, key: string) => {
  //   /**
  //    * TODO: 保留小数点后两位
  //    */
  //   const { value } = e.target;
  //   const reg = /^\d+(\.\d+)?$/; // 正则表达式，匹配正整数
  //   if (!reg.test(value)) {
  //     Toast('error', I18N.eca.inputFormat);
  //     return;
  //   }
  //   const RegChectDoit4 = /^-?\d{0,20}(\.\d{1,4})?$|^0(\.\d{1,4})?$/;

  //   if (!RegChectDoit4.test(e.target.value) || Number(e.target.value) < 0) {
  //     Toast(
  //       'error',
  //       Number(e.target.value) < 0
  //         ? I18N.eca.theInputValueIsNotValid
  //         : I18N.eca.supportDecimalPoint,
  //     );
  //     return;
  //   }

  //   if (dataSource) {
  //     const [first, second, third] = record?.path?.split('-') || [];
  //     const firstIndex = parseInt(first, 10);
  //     const secondIndex = parseInt(second, 10);
  //     const thirdIndex = parseInt(third, 10);

  //     if (!isNaN(firstIndex) && !isNaN(secondIndex) && !isNaN(thirdIndex)) {
  //       if (
  //         dataSource[firstIndex]?.children &&
  //         dataSource[firstIndex].children[secondIndex]?.children
  //       ) {
  //         // @ts-ignore
  //         dataSource[firstIndex].children[secondIndex].children[thirdIndex][
  //           key as string
  //         ] = Number(e.target.value);
  //         // @ts-ignore
  //         setDataSource([...dataSource]);
  //         changeDataSourceFn?.([...dataSource]);
  //       }
  //     }
  //   }
  // };
  const onChangeFN = (value: any, record: ActivityItem, key: string) => {
    /**
     * TODO: 保留小数点后两位
     */
    const reg = /^\d+(\.\d+)?$/; // 正则表达式，匹配正整数
    if (!reg.test(value)) {
      Toast('error', I18N.eca.inputFormat);
      return;
    }
    const RegChectDoit4 = /^-?\d{0,20}(\.\d{1,4})?$|^0(\.\d{1,4})?$/;

    if (!RegChectDoit4.test(value) || Number(value) < 0) {
      Toast(
        'error',
        Number(value) < 0
          ? I18N.eca.theInputValueIsNotValid
          : I18N.eca.supportDecimalPoint,
      );
      return;
    }

    if (dataSource) {
      const [first, second, third] = record?.path?.split('-') || [];
      const firstIndex = parseInt(first, 10);
      const secondIndex = parseInt(second, 10);
      const thirdIndex = parseInt(third, 10);

      if (!isNaN(firstIndex) && !isNaN(secondIndex) && !isNaN(thirdIndex)) {
        if (
          dataSource[firstIndex]?.children &&
          dataSource[firstIndex].children[secondIndex]?.children
        ) {
          // @ts-ignore
          dataSource[firstIndex].children[secondIndex].children[thirdIndex][
            key as string
          ] = value;
          // @ts-ignore
          setDataSource([...dataSource]);
          changeDataSourceFn?.([...dataSource]);
        }
      }
    }
  };
  // const onInputFn = (e: any, record: ActivityItem, key: string) => {
  //   if (dataSource) {
  //     const [first, second, third] = record?.path?.split('-') || [];
  //     const firstIndex = parseInt(first, 10);
  //     const secondIndex = parseInt(second, 10);
  //     const thirdIndex = parseInt(third, 10);

  //     if (!isNaN(firstIndex) && !isNaN(secondIndex) && !isNaN(thirdIndex)) {
  //       if (
  //         dataSource[firstIndex]?.children &&
  //         dataSource[firstIndex].children[secondIndex]?.children
  //       ) {
  //         // @ts-ignore
  //         dataSource[firstIndex].children[secondIndex].children[thirdIndex][
  //           key as string
  //         ] = e.target.value;
  //         // @ts-ignore
  //         setDataSource([...dataSource]);
  //         changeDataSourceFn?.([...dataSource]);
  //       }
  //     }
  //   }
  // };
  const onSelectFn = (e: any, record: ActivityItem, key: string) => {
    if (dataSource) {
      const [first, second, third] = record?.path?.split('-') || [];
      const firstIndex = parseInt(first, 10);
      const secondIndex = parseInt(second, 10);
      const thirdIndex = parseInt(third, 10);

      if (!isNaN(firstIndex) && !isNaN(secondIndex) && !isNaN(thirdIndex)) {
        if (
          dataSource[firstIndex]?.children &&
          dataSource[firstIndex].children[secondIndex]?.children
        ) {
          // @ts-ignore
          dataSource[firstIndex].children[secondIndex].children[thirdIndex][
            key as string
          ] = e;
          // @ts-ignore
          setDataSource([...dataSource]);
          changeDataSourceFn?.([...dataSource]);
        }
      }
    }
  };
  const remarksObj =
    pageTypeInfo === PageTypeInfo.edit
      ? {
          title: I18N.dashborad.remarks,
          width: 120,
          dataIndex: 'remark',
          render: (value: string, record: ActivityItem) => {
            return isFillData && !isDetail ? (
              <Input
                allowClear
                placeholder={I18N.base.pleaseEnter}
                value={value}
                onChange={e => {
                  if (Number(e.target.value.length) <= 200) {
                    if (dataSource) {
                      const [first, second, third] =
                        record?.path?.split('-') || [];
                      const firstIndex = parseInt(first, 10);
                      const secondIndex = parseInt(second, 10);
                      const thirdIndex = parseInt(third, 10);
                      if (
                        !isNaN(firstIndex) &&
                        !isNaN(secondIndex) &&
                        !isNaN(thirdIndex)
                      ) {
                        if (
                          dataSource[firstIndex]?.children &&
                          dataSource[firstIndex].children[secondIndex]?.children
                        ) {
                          // @ts-ignore
                          dataSource[firstIndex].children[secondIndex].children[
                            thirdIndex
                          ]['remark' as string] = e.target.value;
                          // @ts-ignore
                          setDataSource([...dataSource]);
                          changeDataSourceFn?.([...dataSource]);
                        }
                      }
                    }
                  }
                }}
              />
            ) : (
              value || '-'
            );
          },
        }
      : null;
  switch (Number(splitCurrentKey)) {
    case 0:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',

          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },

        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 190,
        },
        {
          title: I18N.eca.activityDataSheet,
          dataIndex: 'activityUnitName',
          width: 120,
        },
        {
          title: I18N.eca.activityData,
          dataIndex: 'dataValue',
          width: 160,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                onChange={async e => {
                  onChangeFN(e, record, 'dataValue');
                }}
              />
            ) : (
              value || '-'
            );
          },
          // copyable: true,
        },
        {
          title: I18N.Factors.emissionFactors,
          dataIndex: 'factorDesc',
          width: 160,
        },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        remarksObj,

        oprateObj,
      ]);
    case 1:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',

          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },

        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 190,
        },
        {
          title: I18N.eca.numberOfEmployees,
          dataIndex: 'employeeNum',
          width: 120,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async (e: any) => {
                //   const { value } = e.target;
                //   const reg = /^\d+$/; // 正则表达式，匹配正整数

                //   if (!reg.test(value)) {
                //     Toast('error', I18N.eca.inputFormat);
                //     return;
                //   }
                //   onBlurFn(e, record, 'employeeNum');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'employeeNum');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.weightedAverageLabor,
          dataIndex: 'avgWorktime',
          width: 190,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.99}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   /**
                //    * TODO: 保留小数点后两位
                //    */
                //   const { value } = e.target;
                //   const reg = /^\d+(\.\d+)?$/; // 正则表达式，匹配正整数
                //   if (!reg.test(value)) {
                //     Toast('error', I18N.eca.inputFormat);
                //     return;
                //   }
                //   const RegChectDoit2 =
                //     /^-?\d{0,20}(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                //   if (!RegChectDoit2.test(e.target.value)) {
                //     Toast('error', I18N.eca.theInputValueIsTheMost);
                //     return;
                //   }
                //   onBlurFn(e, record, 'avgWorktime');
                // }}
                onChange={async e => {
                  const RegChectDoit2 =
                    /^-?\d{0,20}(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                  if (!RegChectDoit2.test(e)) {
                    Toast('error', I18N.eca.theInputValueIsTheMost);
                    return;
                  }
                  onChangeFN(e, record, 'avgWorktime');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.averageWorkingDays,
          dataIndex: 'avgWorkday',
          width: 160,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   const { value } = e.target;
                //   const reg = /^\d+$/; // 正则表达式，匹配正整数

                //   if (!reg.test(value)) {
                //     Toast('error', I18N.eca.inputFormat);
                //     return;
                //   }
                //   onBlurFn(e, record, 'avgWorkday');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'avgWorkday');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.doesItHaveItsOwnOwnership,
          dataIndex: 'ownFactory',
          width: 160,
          render: (value, record) => {
            if (isFillData && !isDetail) {
              return (
                <Select
                  options={[
                    { label: I18N.eca.yes, value: 0 },
                    { label: I18N.eca.no, value: 1 },
                  ]}
                  style={{ width: '100%' }}
                  placeholder={I18N.Factors.pleaseSelect}
                  value={value}
                  onChange={e => {
                    onSelectFn(e, record, 'ownFactory');
                  }}
                />
              );
            }
            return isNull(value)
              ? '-'
              : Number(value) === 1
              ? I18N.eca.no
              : I18N.eca.have;
          },
        },
        {
          title: I18N.eca.dormitoryAccommodator,
          dataIndex: 'guestsNum',
          width: 160,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async (e: any) => {
                //   const value = e?.target?.value;
                //   const reg = /^\d+$/; // 正则表达式，匹配正整数
                //   if (!reg.test(value)) {
                //     Toast('error', I18N.eca.inputFormat);
                //     return;
                //   }
                //   onBlurFn(e, record, 'guestsNum');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'guestsNum');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.averageAccommodationDays,
          dataIndex: 'stayPeriod',
          width: 160,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   const value = e?.target?.value;
                //   const reg = /^\d+$/; // 正则表达式，匹配正整数
                //   if (!reg.test(value)) {
                //     Toast('error', I18N.eca.inputFormat);
                //     return;
                //   }
                //   onBlurFn(e, record, 'stayPeriod');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'stayPeriod');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: (
            <div>
              {I18N.eca.septicTankDepth}{' '}
              <Tooltip
                title={I18N.eca.ifThereIsNoSuchThingWithinTheFactoryArea}
              >
                <ExclamationCircleOutlined />
              </Tooltip>{' '}
            </div>
          ),
          dataIndex: 'depth',
          width: 180,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.99}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   /**
                //    * TODO: 保留小数点后两位
                //    */
                //   const { value } = e.target;
                //   const reg = /^\d+(\.\d+)?$/; // 正则表达式，匹配正整数
                //   if (!reg.test(value)) {
                //     Toast('error', I18N.eca.inputFormat);
                //     return;
                //   }
                //   /**
                //    * TODO: 保留小数点后两位
                //    */
                //   const RegChectDoit2 =
                //     /^-?\d{0,20}(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                //   if (!RegChectDoit2.test(e.target.value)) {
                //     Toast('error', I18N.eca.theInputValueIsTheMost);
                //     return;
                //   }
                //   onBlurFn(e, record, 'depth');
                // }}
                onChange={async e => {
                  const RegChectDoit2 =
                    /^-?\d{0,20}(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                  if (!RegChectDoit2.test(e)) {
                    Toast('error', I18N.eca.theInputValueIsTheMost);
                    return;
                  }
                  onChangeFN(e, record, 'depth');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.methaneEmission2,
          dataIndex: 'dataValue',
          width: 160,
        },

        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        remarksObj,

        oprateObj,
      ]);
    case 2:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },
        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 160,
        },
        {
          title: I18N.eca.wastewaterVolumeT,
          dataIndex: 'escapageVal',
          width: 120,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   onBlurFn(e, record, 'escapageVal');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'escapageVal');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.anaerobicInfluentC,
          dataIndex: 'inflow',
          width: 190,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   onBlurFn(e, record, 'inflow');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'inflow');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.anaerobicEffluentC,
          dataIndex: 'outflow',
          width: 190,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   onBlurFn(e, record, 'outflow');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'outflow');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.anaerobicSludgeProduction,
          dataIndex: 'sludgeYield',
          width: 190,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   onBlurFn(e, record, 'sludgeYield');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'sludgeYield');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.sludgeCod,
          dataIndex: 'sludgeContent',
          width: 190,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   onBlurFn(e, record, 'sludgeContent');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'sludgeContent');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.maximumMethaneProduction,
          dataIndex: 'depth',
          width: 210,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.99}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   /**
                //    * TODO: 保留小数点后两位
                //    */
                //   const { value } = e.target;
                //   const reg = /^\d+(\.\d+)?$/; // 正则表达式，匹配正整数
                //   if (!reg.test(value)) {
                //     Toast('error', I18N.eca.inputFormat);
                //     return;
                //   }
                //   /**
                //    * TODO - 最大甲烷产量正则校验 最多支持输入2小数
                //    * **/
                //   const RegChectDoit2 =
                //     /^-?\d{0,20}(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                //   if (!RegChectDoit2.test(e.target.value)) {
                //     Toast('error', I18N.eca.theInputValueIsTheMost);
                //     return;
                //   }
                //   onBlurFn(e, record, 'depth');
                // }}
                onChange={async e => {
                  const RegChectDoit2 =
                    /^-?\d{0,20}(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                  if (!RegChectDoit2.test(e)) {
                    Toast('error', I18N.eca.theInputValueIsTheMost);
                    return;
                  }
                  onChangeFN(e, record, 'depth');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.methaneEmission,
          dataIndex: 'dataValue',
          width: 190,
        },
        // {
        //   title: I18N.eca.activityDataSheet,
        //   dataIndex: 'activityUnitName',
        //   width: 120,
        // },
        // {
        //   title: I18N.Factors.emissionFactors,
        //   dataIndex: 'factorDesc',
        //   width: 160,
        // },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        remarksObj,

        oprateObj,
      ]);
    case 3:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          width: 160,
          fixed: 'left',

          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },
        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 160,
        },
        // {
        //   title: I18N.eca.sourceOfEscape,
        //   dataIndex: 'escapeSource',
        //   width: 120,
        //   render: (value, record) => {
        //     return isFillData && !isDetail ? (
        //       <Input
        //         value={value}
        //         min={0}
        //         style={{ width: '100%' }}
        //         placeholder={I18N.base.pleaseEnter}
        //         onChange={async e => {
        //           if (e.target.value.length <= 50) {
        //             onInputFn(e, record, 'escapeSource');
        //           }
        //         }}
        //       />
        //     ) : (
        //       value || '-'
        //     );
        //   },
        // },
        {
          title: I18N.eca.refrigerantType,
          dataIndex: 'refrigerantType',
          width: 120,
          render: (value, record) => {
            const newPFCseNUMArr = PFCseNUMArr?.map(item => {
              return {
                ...item,
              };
            });
            if (isFillData && !isDetail) {
              return (
                <Select
                  options={[...(newPFCseNUMArr || [])]}
                  style={{ width: '100%' }}
                  placeholder={I18N.Factors.pleaseSelect}
                  value={value}
                  onChange={e => {
                    onSelectFn(e, record, 'refrigerantType');
                  }}
                />
              );
            }
            return value || '-';
          },
        },
        {
          title: I18N.eca.fillingCapacityKg,
          dataIndex: 'dataValue',
          width: 120,
          render: (value, record) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   onBlurFn(e, record, 'dataValue');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'dataValue');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.activityDataSheet,
          dataIndex: 'activityUnitName',
          width: 120,
        },
        // {
        //   title: I18N.Factors.emissionFactors,
        //   dataIndex: 'factorDesc',
        //   width: 160,
        // },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        remarksObj,

        oprateObj,
      ]);
    default:
      return compact([
        {
          title: I18N.eca.ghgClassification,
          dataIndex: 'ghgClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.ghgCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.isoClassification,
          dataIndex: 'isoClassify_name',
          width: 120,
          fixed: 'left',

          render: (text: string, record) => {
            return `${record?.isoCategory_name},${text}`;
          },
        },
        {
          title: I18N.eca.emissionSourceName,
          dataIndex: 'sourceName',
          fixed: 'left',
          width: 160,
          // copyable: true,
        },
        {
          title: I18N.eca.emissionSourceId,
          dataIndex: 'sourceCode',
          width: 160,
        },
        {
          title: I18N.eca.emissionFacilityActivity,
          dataIndex: 'facility',
          width: 160,
        },

        // {
        //   title: I18N.eca.sourceOfEscape,
        //   dataIndex: 'escapeSource',
        //   width: 120,
        //   render: (value, record) => {
        //     return isFillData && !isDetail ? (
        //       <Input
        //         value={value}
        //         style={{ width: '100%' }}
        //         placeholder={I18N.base.pleaseEnter}
        //         onChange={async e => {
        //           if (e.target.value.length <= 50) {
        //             onInputFn(e, record, 'escapeSource');
        //           }
        //         }}
        //       />
        //     ) : (
        //       value || '-'
        //     );
        //   },
        // },
        {
          title: I18N.eca.perfluorocarbonType,
          dataIndex: 'refrigerantType',
          width: 120,
          render: (value, record) => {
            if (isFillData && !isDetail) {
              const newHFCsEnumArr = HFCsEnumArr?.map(item => {
                return {
                  ...item,
                };
              });
              return (
                <Select
                  options={[...(newHFCsEnumArr || [])]}
                  style={{ width: '100%' }}
                  placeholder={I18N.Factors.pleaseSelect}
                  value={value}
                  onChange={e => {
                    onSelectFn(e, record, 'refrigerantType');
                  }}
                />
              );
            }
            return value || '-';
          },
        },
        {
          title: I18N.eca.escalationAmountKg,
          dataIndex: 'dataValue',
          width: 120,
          render: (value: any, record: ActivityItem) => {
            return isFillData && !isDetail ? (
              <InputNumber
                controls={false}
                value={value}
                min={0}
                style={{ width: '100%' }}
                max={999999999999.9999}
                placeholder={I18N.base.pleaseEnter}
                // onBlur={async e => {
                //   onBlurFn(e, record, 'dataValue');
                // }}
                onChange={async e => {
                  onChangeFN(e, record, 'dataValue');
                }}
              />
            ) : (
              value || '-'
            );
          },
        },
        {
          title: I18N.eca.activityDataSheet,
          dataIndex: 'activityUnitName',
          width: 120,
        },
        // {
        //   title: I18N.Factors.emissionFactors,
        //   dataIndex: 'factorDesc',
        //   width: 160,
        // },
        {
          title: I18N.carbonData.emissionsTC,
          dataIndex: 'carbonEmission',
          width: 160,
          // copyable: true,
        },
        remarksObj,

        oprateObj,
      ]);
  }
};

// 核算模型- 选择排放源
export const chooseMeissionSourceColumns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps<TypeComputation>['columns'] => {
  return [
    ...returnCommelete(),
    {
      title: I18N.Factors.operation,
      width: 120,
      dataIndex: 'id',
      render(id) {
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/role/detail', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
              checkAuth('/sys/role/del', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    content: I18N.eca.confirmDeletionOfThis7,
                    onOk: () => {
                      return postComputationEmissionSourceDelete({
                        req: { id },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', I18N.Factors.deleteSuccessful);
                          refresh?.();
                        }
                      });
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};

/** 数据处理 */
const getTreeData = (arr: EnumResp[]) => {
  return arr.map(node => {
    const { name, code, subList } = node || {};
    if (subList && subList.length) {
      node.subList = getTreeData(subList);
    }
    return {
      ...node,
      label: name,
      value: String(code),
    };
  });
};

export const SearchSchema = (): SearchProps<any>['schema'] => {
  const GHGCategoryArr = FistComputationEnums('GHGCategory');
  // const ISOCategoryArr = FistComputationEnums('ISOCategory');
  const { locale } = useContext(LocaleContext);
  const likeSourceNameObj = {
    'en-US': 'likeSourceName',
    'zh-CN': 'likeSourceName',
  };
  // const likeFacility = {
  //   'en-US': 'likeFacility',
  //   'zh-CN': 'likeFacility',
  // };

  return {
    type: 'object',
    properties: {
      [likeSourceNameObj[locale]]: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.emissionSourceName,
      }),
      // sourceCode: xRenderSeachSchema({
      //   type: 'string',
      //   placeholder: I18N.eca.emissionSourceId,
      // }),
      // [likeFacility[locale]]: xRenderSeachSchema({
      //   type: 'string',
      //   placeholder: I18N.eca.emissionFacilityActivity2,
      // }),
      ghg: xRenderSeachSchema({
        type: 'array',
        placeholder: I18N.eca.ghgClassification,
        widget: 'cascader',
        props: {
          fieldNames: { label: 'label', value: 'value', children: 'subList' },
          changeOnSelect: true,
          options: getTreeData(GHGCategoryArr),
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      // iso: xRenderSeachSchema({
      //   type: 'array',
      //   placeholder: I18N.eca.isoClassification,
      //   widget: 'cascader',
      //   props: {
      //     options: getTreeData(ISOCategoryArr),
      //     fieldNames: { label: 'label', value: 'value', children: 'subList' },
      //     changeOnSelect: true,
      //     showSearch: true,
      //     filterOption: (input: string, option: any) =>
      //       (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      //   },
      // }),
    },
  };
};
export const ListSearchSchema = ({
  orgTreeData,
}: {
  orgTreeData: OrgTree[];
}): SearchProps<any>['schema'] => {
  // const GHGCategoryArr = FistComputationEnums('GHGCategory');
  // const ISOCategoryArr = FistComputationEnums('ISOCategory');
  // const likeFacility = {
  //   'en-US': 'likeFacility',
  //   'zh-CN': 'likeFacility',
  // };

  return {
    type: 'object',
    properties: {
      likeSourceName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.emissionSourceName,
        props: {
          style: { width: '220px', marginRight: '24px' },
        },
      }),
      orgCode: xRenderSeachSchema({
        placeholder: '核算组织',
        type: 'string',
        widget: 'TreeSelect',
        props: {
          treeData: orgTreeData,
          treeDefaultExpandAll: true,
          showSearch: true,
          allowClear: true,
          treeNodeFilterProp: 'label',
          style: { width: '220px' },
        },
      }),
      // sourceCode: xRenderSeachSchema({
      //   type: 'string',
      //   placeholder: I18N.eca.emissionSourceId,
      // }),
      // [likeFacility[locale]]: xRenderSeachSchema({
      //   type: 'string',
      //   placeholder: I18N.eca.emissionFacilityActivity2,
      // }),
      // ghg: xRenderSeachSchema({
      //   type: 'array',
      //   placeholder: I18N.eca.ghgClassification,
      //   widget: 'cascader',
      //   props: {
      //     fieldNames: { label: 'label', value: 'value', children: 'subList' },
      //     changeOnSelect: true,
      //     options: getTreeData(GHGCategoryArr),
      //     showSearch: true,
      //     filterOption: (input: string, option: any) =>
      //       (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      //   },
      // }),
      // iso: xRenderSeachSchema({
      //   type: 'array',
      //   placeholder: I18N.eca.isoClassification,
      //   widget: 'cascader',
      //   props: {
      //     options: getTreeData(ISOCategoryArr),
      //     fieldNames: { label: 'label', value: 'value', children: 'subList' },
      //     changeOnSelect: true,
      //     showSearch: true,
      //     filterOption: (input: string, option: any) =>
      //       (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      //   },
      // }),
      // emissionStatus: xRenderSeachSchema({
      //   required: false,
      //   type: 'string',
      //   placeholder: I18N.Factors.state,
      //   widget: 'select',
      //   enum: ['0', '1'],
      //   enumNames: [I18N.Factors.enable, I18N.Factors.disabled],
      //   props: {
      //     allowClear: true,
      //     showSearch: true,
      //     filterOption: (input: string, option: any) =>
      //       (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      //   },
      // }),
    },
  };
};
