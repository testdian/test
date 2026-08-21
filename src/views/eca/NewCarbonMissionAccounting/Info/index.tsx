// 认证中心碳排放核算详情
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
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import style from '@views/eca/dataQualityManage/controlPlan/index.module.less';
import { Tabs, TabsProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import {
  Computation,
  getComputationComputationId,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  OrgTree,
  getComputationComputationOrgList,
} from '@/sdks_v2/new/computationV2ApiDocs';

import { schema } from '../../carbonMissionAccounting/Info/utils/schemas';
import { CustomTable } from '../../carbonMissionAccounting/component/CustomTable';
import { Median } from '../../component/Division';
import { TextArea } from '../../component/TextArea';
import { GwpListFn, ModelListFn } from '../../emissionManage/hooks';
import { UseOrgs } from '../../hooks';
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
    computationDataId,
    pageTypeInfo,
    CarbonMissionPageInfo,
    CarbonMissionPageTypeInfo,
    CarbonMissionId,
  } = useParams<{
    pageTypeInfo: PageTypeInfo;
    CarbonMissionPageInfo: string;
    CarbonMissionPageTypeInfo: string;
    computationDataId: string;
    CarbonMissionId: string;
  }>();
  const useOrgArr = UseOrgs();
  const [dataSource, getDataSource] = useState<OrgTree[]>([]);
  const [modelArr, setModalArr] = useState<any[]>([]);

  const gwpDataSource = GwpListFn();
  const orgArrFn = async () => {
    await getComputationComputationOrgList({
      orgId: Number(useOrgArr[0]?.id),
      computationId: useOrgArr[0]?.id,
    }).then(({ data }) => {
      getDataSource([...(data.data?.tree || [])]);
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
              };
            }),
          });
          // 如果是编辑核算
          // if (pageTypeInfo === PageTypeInfo.edit) {
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
          current.setFieldState('allCheckedList', {
            readPretty: true,
          });
          // }
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
  }, [pageTypeInfo, useOrgArr, dataSource, gwpDataSource, formValue, modelArr]);
  /** 排放源详情**/
  const emissionSourceFn = (id: string) => {
    getComputationComputationId({ id: Number(id) }).then(async ({ data }) => {
      if (data.code === 200) {
        getFormValue({
          ...data.data,
          dataPeriod: data.data?.dataPeriod,
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
    if (CarbonMissionId) {
      emissionSourceFn(CarbonMissionId);
      return;
    }
    // debugger;
    if (computationDataId) {
      emissionSourceFn(computationDataId);
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
      <Tabs
        defaultActiveKey='1'
        items={items}
        onChange={value => {
          setCurrentValue(value);
        }}
        className='customTabs'
      />
      {Number(currentValue) === 1 && (
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={schema(dataSource)} />
        </Form>
      )}
      {/* 选择排放核算 - 排放源详情 */}
      {Number(currentValue) === 2 && <EmissionSourceList />}
      {/* <FormActions
        place='center'
        buttons={compact([
          {
            title:
              PageTypeInfo.show !== pageTypeInfo
                ? I18N.Factors.cancel
                : I18N.Factors.return,
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      /> */}
    </div>
  );
};

export default OrgInfo;
