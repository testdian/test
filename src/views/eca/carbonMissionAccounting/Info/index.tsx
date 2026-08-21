/*
 * @@description: 碳排放核算详情
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-15 14:20:58
 */
import {
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd-v5';
import {
  createForm,
  onFieldValueChange,
  onFormInit,
  onFormMount,
} from '@formily/core';
// import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import style from '@views/eca/dataQualityManage/controlPlan/index.module.less';
import { Tabs, TabsProps } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
// import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// import { OrgTree } from '@/sdks/systemV2ApiDocs';
import { FormActions } from '@/components/FormActions';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Computation,
  getComputationComputationId,
  postComputationComputationAdd,
  postComputationComputationEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  OrgTree,
  getComputationComputationOrgList,
} from '@/sdks_v2/new/computationV2ApiDocs';
// import { RootState } from '@/store/types';
import { ORG_STATUS } from '@/utils/const';

import { schema } from './utils/schemas';
import EmissionSource from '../../accountingModel/emissionSource';
import { Median } from '../../component/Division';
import { TextArea } from '../../component/TextArea';
import { GwpListFn, ModelListFn } from '../../emissionManage/hooks';
import { UseOrgs } from '../../hooks';
import { culHistoryFn } from '../../util/util';
import { CustomTable } from '../component/CustomTable';
import EmissionSourceList from '../component/EmissionSourceList';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    Checkbox,
    Radio,
    Median,
    DatePicker,
    CustomTable,
    Select,
    TextArea,
  },
});

const OrgInfo = () => {
  // 当前 currentValue
  const [currentValue, setCurrentValue] = useState<string>('1');
  const [formValue, getFormValue] = useState<Computation>({ dataPeriod: '1' });
  const {
    id,
    pageTypeInfo,
    CarbonMissionId,
    CarbonMissionPageInfo,
    CarbonMissionPageTypeInfo,
    computationDataId,
  } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
    CarbonMissionPageInfo: string;
    CarbonMissionId: string;
    CarbonMissionPageTypeInfo: string;
    computationDataId: string;
  }>();
  const useOrgArr = UseOrgs();
  const navigate = useNavigate();
  // 获取组织范围
  // const userInfo = useSelector<RootState, RootState['userInfo']>(
  //   s => s.userInfo,
  // );
  const [dataSource, getDataSource] = useState<OrgTree[]>([]);
  const [modelArr, setModalArr] = useState<any[]>([]);

  const gwpDataSource = GwpListFn();
  const orgArrFn = async () => {
    await getComputationComputationOrgList({
      orgId: Number(useOrgArr[0]?.id),
      computationId: useOrgArr[0]?.id,
    }).then(({ data }) => {
      // form.st('dataSource', data?.data?.tree);
      getDataSource([...(data.data?.tree || [])]);
      // form.setFieldState('allCheckedList', {
      //   dataSouce: [...(data?.data?.tree || [])],
      // });
    });
  };
  useEffect(() => {
    if (useOrgArr) {
      orgArrFn();
    }
  }, [useOrgArr]);
  const modalArrFn = async (
    value: number | undefined,
    year: number | undefined,
  ) => {
    const { data } = await ModelListFn(value, year);
    const newArr = data?.list?.map(item => {
      return {
        label: item?.modelName,
        value: item?.id,
      };
    });
    if (pageTypeInfo !== PageTypeInfo.add) {
      setModalArr([...(newArr || [])]);
    } else {
      form.setFieldState('modelId', {
        dataSource: [...(newArr || [])],
        value: null,
      });
      setModalArr([...(newArr || [])]);
    }
  };
  const form = useMemo(() => {
    return createForm({
      readPretty:
        CarbonMissionPageInfo === PageTypeInfo.show ||
        pageTypeInfo === PageTypeInfo.show ||
        CarbonMissionPageTypeInfo === PageTypeInfo.show,
      values: formValue,
      effects() {
        onFormInit(async current => {
          // 获取当前用户下的组织
          current.setFieldState('gwpVersion', {
            dataSource: gwpDataSource?.map(
              (item: { dictLabel: string; dictValue: string }) => {
                return {
                  label: item.dictLabel,
                  value: item.dictValue,
                };
              },
            ),
            initialValue: 'IPCC AR6',
          });
          // 核算模型 ModelList
          current.setFieldState('modelId', {
            dataSource: modelArr,
          });
          current.setFieldState('orgId', {
            dataSource: useOrgArr?.map(item => {
              return {
                label: item.orgName,
                value: item.id,
                disabled: item.orgStatus === ORG_STATUS.DISABLE,
              };
            }),
          });
          // 如果是编辑核算
          if (pageTypeInfo === PageTypeInfo.edit) {
            current.setFieldState('orgId', {
              readPretty: true,
            });
            current.setFieldState('year', {
              readPretty: true,
            });
            current.setFieldState('dataPeriod', {
              readPretty: true,
            });
            current.setFieldState('modelId', {
              readPretty: true,
            });
          }
        });
        onFormMount(async () => {
          // 碳排放核算
        });
        onFieldValueChange('orgId', async field => {
          const { value } = field;
          getFormValue(form.getValuesIn('*'));
          form.setFieldState('allCheckedList', {
            value: [value],
          });
          await modalArrFn(value, form.getFieldState('year').value);
        });
        onFieldValueChange('year', async field => {
          const { value } = field;
          getFormValue(form.getValuesIn('*'));
          await modalArrFn(form.getFieldState('orgId').value, value);
        });
      },
    });
  }, [
    pageTypeInfo,
    id,
    useOrgArr,
    dataSource,
    gwpDataSource,
    formValue,
    modelArr,
  ]);
  /** 排放源详情**/
  const emissionSourceFn = (id: string) => {
    getComputationComputationId({ id: Number(id) }).then(async ({ data }) => {
      if (data.code === 200) {
        getFormValue({
          ...data.data,
          dataPeriod:
            PageTypeInfo.show === pageTypeInfo
              ? data.data?.dataPeriod
              : data.data?.dataPeriod
              ? `${data.data?.dataPeriod}`
              : data.data?.dataPeriod,
          // @ts-ignore
          allCheckedList: data.data.allCheckedList
            ? // @ts-ignore
              [data.data?.orgId, ...data.data.allCheckedList]
            : [data.data?.orgId],
        });
        await modalArrFn(data.data?.orgId, data.data?.year);
      }
    });
  };
  /** 获取组织信息 */
  useEffect(() => {
    // 如果是选择排放源
    if (
      window.location.pathname.indexOf(
        '/carbonAccounting/carbonMissionAccounting/emissionSource/',
      ) >= 0
    ) {
      setCurrentValue('2');
    }
    if (computationDataId) {
      emissionSourceFn(computationDataId);

      return;
    }
    if (CarbonMissionId) {
      emissionSourceFn(CarbonMissionId);
      return;
    }
    if (id && pageTypeInfo !== PageTypeInfo.add) {
      emissionSourceFn(id);
    }
  }, []);
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: I18N.Factors.basicInformation,
    },
    {
      key: '2',
      label: I18N.eca.listOfEmissionSources,
    },
  ];
  const returnFormActionsFn = () => {
    switch (true) {
      case Boolean(CarbonMissionPageInfo):
        return (
          <FormActions
            place='center'
            buttons={compact([
              {
                title:
                  PageTypeInfo.show !== pageTypeInfo
                    ? I18N.Factors.cancel
                    : I18N.Factors.return,
                onClick: async () => {
                  history.go(-1);
                  // navigate(culHistoryFn());
                },
              },
            ])}
          />
        );
      case Boolean(CarbonMissionPageTypeInfo):
        return (
          <FormActions
            place='center'
            buttons={compact([
              {
                title:
                  PageTypeInfo.show !== pageTypeInfo
                    ? I18N.Factors.cancel
                    : I18N.Factors.return,
                onClick: async () => {
                  history.go(-1);
                  // navigate(culHistoryFn());
                },
              },
            ])}
          />
        );
      default:
        return (
          <FormActions
            place='center'
            buttons={compact([
              pageTypeInfo !== PageTypeInfo.show &&
                window.location.pathname.indexOf('emissionSource') === -1 && {
                  title:
                    pageTypeInfo === PageTypeInfo.add
                      ? I18N.Factors.saveNextStep
                      : I18N.Factors.preserve,
                  type: 'primary',
                  onClick: async () => {
                    form.submit(async (value: any) => {
                      const newValue = {
                        allCheckedList: value?.allCheckedList,
                        dataPeriod: value?.dataPeriod,
                        orgId: value?.orgId,
                        year: value?.year,
                        computationName: value?.computationName,
                        gwpVersion: value?.gwpVersion,
                        companyId: value?.companyId,
                        modelId: value?.modelId,
                      };
                      if (pageTypeInfo === PageTypeInfo.add) {
                        await postComputationComputationAdd({
                          req: { ...newValue },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            // history.go(-1);
                            // 进入排放源
                            navigate(
                              virtualLinkTransform(
                                EcaRouteMaps.carbonMissionAccountingSourceInfo,
                                [PAGE_TYPE_VAR, ':id'],
                                [PageTypeInfo.add, data?.data as string],
                              ),
                            );
                            // window.open(
                            //   virtualLinkTransform(
                            //     EcaRouteMaps.carbonMissionAccountingSourceInfo,
                            //     [PAGE_TYPE_VAR, ':id'],
                            //     [PageTypeInfo.show, data?.data as string],
                            //   ),
                            // );
                          }
                        });
                      }
                      if (pageTypeInfo === PageTypeInfo.edit) {
                        await postComputationComputationEdit({
                          req: { ...newValue, id: Number(id) },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            history.go(-1);
                          }
                        });
                      }
                    });
                  },
                },
              {
                title:
                  PageTypeInfo.show !== pageTypeInfo
                    ? I18N.Factors.cancel
                    : I18N.Factors.return,
                onClick: async () => {
                  // history.go(-1);
                  navigate(culHistoryFn());
                },
              },
            ])}
          />
        );
    }
  };
  return (
    <div className={style.wrapper}>
      {/* 如果是新增核算 Tabs隐藏 */}
      {![
        '/carbonAccounting/carbonMissionAccounting/carbonMission/add',
        '/carbonAccounting/carbonMissionAccounting/carbonMission/edit',
        '/carbonAccounting/carbonMissionAccounting/emissionSource/',
      ].some(item => window.location.pathname.indexOf(item) >= 0) && (
        <Tabs
          defaultActiveKey='1'
          items={items}
          onChange={value => {
            setCurrentValue(value);
          }}
          className='customTabs'
        />
      )}
      {Number(currentValue) === 1 &&
        [
          '/carbonAccounting/carbonMissionAccounting/carbonMission/',
          'ChooseCarbonMission',
          'CarbonMissionInfo',
        ].some(item => window.location.pathname.indexOf(item) >= 0) && (
          <Form form={form} previewTextPlaceholder='-'>
            <SchemaField schema={schema(dataSource)} />
          </Form>
        )}
      {/* 排放源列表 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/emissionSource',
        ) >= 0 && <EmissionSource />}
      {/* 选择排放核算 - 排放源详情 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf('ChooseCarbonMission') >= 0 && (
          <EmissionSourceList />
        )}
      {/*  认证审核 - 企业碳核算  - 查看碳排放核算 */}
      {/* 选择排放核算 - 排放源详情 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf('CarbonMissionInfo') >= 0 && (
          <EmissionSourceList />
        )}
      {/* 碳排放核算详情 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/carbonMission/',
        ) >= 0 &&
        pageTypeInfo === PageTypeInfo.show && <EmissionSourceList />}

      {returnFormActionsFn()}
    </div>
  );
};

export default OrgInfo;
