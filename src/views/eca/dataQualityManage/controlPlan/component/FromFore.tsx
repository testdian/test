/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-22 10:07:28
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 15:11:46
 */
import {
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd-v5';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { useEffect, useImperativeHandle, useState } from 'react';

import {
  ControlPlanResp,
  postComputationControlPlanEditBorder,
} from '@/sdks/computation/computationV2ApiDocs';
import { processData } from '@/utils';
import { TextArea } from '@/views/eca/component/TextArea';
import { FormForeSchema } from '@/views/eca/dataQualityManage/utils/schema';
import { ComputationEnums } from '@/views/eca/hooks';

export type SubmitFormForeRef = {
  submitFormFore: () => void;
};
export const FormFore = ({
  isEdit,
  currentPlanIndex,
  cRef,
  formValue,
  controlPlanIdFn,
  gasEnums,
}: {
  isEdit: boolean;
  currentPlanIndex: number;
  cRef?: React.MutableRefObject<SubmitFormForeRef | undefined>;
  formValue: ControlPlanResp;
  controlPlanIdFn: () => void;
  gasEnums?: { [key: string]: any };
}) => {
  const [langIdObj, setLangIdObj] = useState<{ [key: string]: number }>({});
  const [langUageObj, setlangUageObj] = useState<{ [key: string]: any }>({});

  // 版本及修订表单
  const formFore = createForm({
    readPretty: !isEdit,
    ...langUageObj,
    values: { ...formValue, ...langUageObj },
    visible: currentPlanIndex === 4,
    effects() {
      onFormInit(current => {
        const borderMethodArr = ComputationEnums('BorderMethod');
        // 获取当前用户下的组织
        current.setFieldState('borderMethod', {
          dataSource: [...borderMethodArr],
        });
      });
    },
  });
  useEffect(() => {
    if (formValue) {
      const langUageObj: { [ket: string]: any } = {};
      const langUageIdObj: { [ket: string]: any } = {};
      (formValue?.languageSourceList as any[])?.forEach(
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
      setlangUageObj(langUageObj);
      setLangIdObj(langUageIdObj);
    }
  }, [formValue]);
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
      TextArea,
    },
  });
  useImperativeHandle(cRef, () => ({
    submitFormFore: async () => {
      formFore.submit(async (value: any) => {
        const submitValue = {
          borderChange: value?.borderChange, // 组织边界设定方法
          borderDesc: value?.borderDesc, // 组织边界描述
          borderMethod: value?.borderMethod, // 组织边界设定方法
          dataQuality: value?.dataQuality,
          id: value?.id,
          controlPlanId: value?.controlPlanId,
        };
        const processResult = processData(
          value || {},
          gasEnums || {},
          langIdObj,
        );
        await postComputationControlPlanEditBorder({
          req: {
            ...submitValue,
            languageSourceList: [...(processResult || [])],
          },
        });
        controlPlanIdFn();
      });
    },
  }));
  return (
    <Form form={formFore} previewTextPlaceholder='-'>
      <SchemaField schema={FormForeSchema()} />
    </Form>
  );
};
