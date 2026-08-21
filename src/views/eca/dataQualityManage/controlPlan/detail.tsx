import {
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd-v5';
import { createForm, onFormMount } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { useLanguage } from '@/hooks';
import {
  getComputationControlPlanDataId,
  postComputationControlPlanEditPlan,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast, processData } from '@/utils';
import { ControlDetailSchema } from '@/views/eca/dataQualityManage/utils/schema';

import { TextArea } from '../../component/TextArea';

export type SubmitFormSixRef = {
  submitFormSix: () => void;
};
const ControlPlan = () => {
  const { id, controlPlanId, standardType } = useParams<{
    id: string;
    controlPlanId: string;
    standardType: string;
  }>();
  console.log(controlPlanId, standardType);
  const gasEnums = useLanguage();
  const [langIdObj, setLangIdObj] = useState<{ [key: string]: number }>({});
  // const [langUageObj, setlangUageObj] = useState<{ [key: string]: any }>({});
  const [formvalues, setformvalues] = useState<any>({});

  // const controlPlanId =
  //   new URLSearchParams(location.search).get('controlPlanId') || '';
  // const standardType =
  //   new URLSearchParams(location.search).get('standardType') || '';
  // 版本及修订表单
  const formSix = createForm({
    readPretty: window.location?.pathname.indexOf('show') >= 0,
    // disabled: window.location?.pathname.indexOf('show') >= 0,
    effects() {
      onFormMount(current => {
        current.setFieldState('isoCategory_name', {
          display: Number(standardType) === 2 ? 'visible' : 'hidden',
        });
        current.setFieldState('isoClassify_name', {
          display: Number(standardType) === 2 ? 'visible' : 'hidden',
        });
        current.setFieldState('ghgCategory_name', {
          display: Number(standardType) === 2 ? 'hidden' : 'visible',
        });
        current.setFieldState('ghgClassify_name', {
          display: Number(standardType) === 2 ? 'hidden' : 'visible',
        });
      });
    },
    values: {
      ...formvalues,
    },
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
      Checkbox,
      TextArea,
    },
  });
  const getControlDetailFn = async () => {
    await getComputationControlPlanDataId({
      id: Number(controlPlanId),
    }).then(({ data }) => {
      if (data.code === 200) {
        const langUageObj: { [ket: string]: any } = {};
        const langUageIdObj: { [ket: string]: any } = {};
        (data.data?.languageSourceList as any[])?.forEach(
          (item: {
            sourceType_name: any;
            langType_name: any;
            sourceValue: any;
            id: any;
          }) => {
            langUageObj[`${item.sourceType_name}En`] = item.sourceValue;
            langUageIdObj[`${item.sourceType_name}`] = item.id;
          },
        );

        setLangIdObj(langUageIdObj);
        setformvalues({
          ...langUageObj,
          ...data.data,
          calculateType: data?.data?.calculateType?.split(','),
        });
      }
    });
  };
  useEffect(() => {
    getControlDetailFn();
  }, []);

  return (
    <div style={{ marginBottom: '40px' }}>
      <Form form={formSix} previewTextPlaceholder='-'>
        <SchemaField schema={ControlDetailSchema()} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          window.location.pathname.indexOf('show') === -1 && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              formSix.submit(async value => {
                const processResult = processData(
                  value || {},
                  gasEnums || {},
                  langIdObj,
                );
                const submitValue = value?.computationFlag
                  ? {
                      activityDesc: value?.activityDesc,
                      calculateDesc: value?.calculateDesc,
                      calculateType: value?.calculateType?.toString(),
                      collectDesc: value?.collectDesc,
                      computationFlag: value?.computationFlag,
                      controlPlanId: Number(id),
                      id: Number(controlPlanId),
                      storageDesc: value?.storageDesc,
                    }
                  : {
                      activityDesc: value?.activityDesc,
                      controlPlanId: Number(id),
                      id: Number(controlPlanId),
                      computationFlag: value?.computationFlag,
                    };
                await postComputationControlPlanEditPlan({
                  req: {
                    ...submitValue,
                    languageSourceList: [...(processResult || [])],
                  },
                }).then(() => {
                  history.go(-1);
                  Toast('success', I18N.Factors.saveSuccessful);
                });
              });
            },
          },
          {
            title: I18N.Factors.cancel,
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};
export default ControlPlan;
