/*
 * @@description: 碳排放核算详情
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-05-06 14:50:32
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
  getComputationComputationOrgList,
  postComputationComputationAdd,
  postComputationComputationEdit,
} from '@/sdks/computation/computationV2ApiDocs';

import { schema } from './utils/schemas';
import EmissionSource from '../../accountingModel/emissionSource';
import { Median } from '../../component/Division';
import { TextArea } from '../../component/TextArea';
import { UseOrgs } from '../../hooks';
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
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const useOrgArr = UseOrgs();
  const navigate = useNavigate();
  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      values: formValue,
      effects() {
        onFormInit(current => {
          // 获取当前用户下的组织
          current.setFieldState('orgId', {
            dataSource: useOrgArr?.map(item => {
              return {
                label: item.orgName,
                value: item.id,
              };
            }),
          });
          // 如果是编辑核算
          if (pageTypeInfo === PageTypeInfo.edit) {
            current.setFieldState('orgId', {
              readPretty: true,
            });
          }
        });
        onFormMount(current => {
          if (id && PageTypeInfo.add !== pageTypeInfo) {
            getComputationComputationId({ id: +id }).then(({ data }) => {
              if (data.code === 200) {
                treeFn(data.data?.orgId || 0);
                // getFormValue({ ...data?.data });
                current.setValues({
                  ...data.data,
                  // dataPeriod: `${data.data?.dataPeriod}`,
                  dataPeriod:
                    PageTypeInfo.show === pageTypeInfo
                      ? data.data?.dataPeriod
                      : `${data.data?.dataPeriod}`,
                });
              }
            });
          }
        });
        onFieldValueChange('orgId', async field => {
          const { value } = field;
          getFormValue(form.getValuesIn('*'));
          treeFn(value);
        });
      },
    });
  }, [pageTypeInfo, id, useOrgArr]);
  const treeFn = async (value: number) => {
    if (pageTypeInfo === PageTypeInfo.add) {
      await getComputationComputationOrgList({ orgId: value }).then(
        ({ data }) => {
          if (data.code === 200) {
            form.setValuesIn('allCheckedList', data?.data?.allCheckedList);
            form.setValuesIn('dataSource', data?.data?.tree);
          }
        },
      );
    } else {
      await getComputationComputationOrgList({
        orgId: value,
        computationId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          form.setValuesIn('allCheckedList', data?.data?.allCheckedList);
          form.setValuesIn('dataSource', data?.data?.tree);
        }
      });
    }
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
        />
      )}
      {/* <FormConsumer>
        {() => (
          <code>
            <pre>{JSON.stringify(form.values.dataPeriod, null, 2)}</pre>
          </code>
        )}
      </FormConsumer> */}
      {Number(currentValue) === 1 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/carbonMission/',
        ) >= 0 && (
          <Form form={form} previewTextPlaceholder='-'>
            <SchemaField schema={schema()} />
          </Form>
        )}
      {/* 排放源列表 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/emissionSource',
        ) >= 0 && <EmissionSource />}
      {/* 碳排放核算详情 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/carbonMission/',
        ) >= 0 &&
        pageTypeInfo === PageTypeInfo.show && <EmissionSourceList />}
      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show &&
            window.location.pathname.indexOf('emissionSource') === -1 && {
              title:
                pageTypeInfo === PageTypeInfo.add
                  ? I18N.Factors.saveNextStep
                  : I18N.carbonFootPrintLCA.confirm,
              type: 'primary',
              onClick: async () => {
                form.submit(async (value: any) => {
                  const newValue = {
                    allCheckedList: value?.allCheckedList,
                    dataPeriod: value?.dataPeriod,
                    orgId: value?.orgId,
                    year: value?.year,
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
                            [PageTypeInfo.show, data?.data as string],
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
          window.location.pathname.includes(
            '/carbonAccounting/carbonMissionAccounting/emissionSource/add',
          ) && {
            title: I18N.carbonFootPrintLCA.confirm,
            onClick: async () => {
              if (
                window.location.pathname.indexOf(
                  '/carbonAccounting/carbonMissionAccounting/emissionSource',
                ) >= 0
              ) {
                navigate(EcaRouteMaps.carbonMissionAccounting);
                return;
              }
              history.go(-1);
            },
            type: 'primary',
          },
          {
            // title: PageTypeInfo.show !== pageTypeInfo ? '取消' : '返回',
            title: I18N.Factors.return,
            onClick: async () => {
              if (
                window.location.pathname.indexOf(
                  '/carbonAccounting/carbonMissionAccounting/emissionSource',
                ) >= 0
              ) {
                navigate(EcaRouteMaps.carbonMissionAccounting);
                return;
              }
              history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};

export default OrgInfo;
