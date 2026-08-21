/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-22 10:07:28
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 15:11:59
 */

import {
  Form,
  DatePicker,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { useImperativeHandle } from 'react';

import {
  ControlPlanResp,
  postComputationControlPlanEditBorder,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast } from '@/utils';
import { TextArea } from '@/views/eca/component/TextArea';
import { FormSixSchema } from '@/views/eca/dataQualityManage/utils/schema';

export type SubmitFormSixRef = {
  submitFormSix: () => void;
};
export const FromSix = ({
  isEdit,
  currentPlanIndex,
  cRef,
  formValue,
  controlPlanIdFn,
}: {
  isEdit: boolean;
  currentPlanIndex: number;
  cRef?: React.MutableRefObject<SubmitFormSixRef | undefined>;
  formValue: ControlPlanResp;
  controlPlanIdFn: () => void;
}) => {
  // 版本及修订表单
  const formSix = createForm({
    readPretty: !isEdit,
    values: formValue,
    visible: currentPlanIndex === 6,
    effects() {},
  });
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
    submitFormSix: async () => {
      formSix.submit(async (value: any) => {
        const submitValue = {
          dataQuality: value?.dataQuality,
          id: value?.id,
          controlPlanId: value?.controlPlanId,
        };
        await postComputationControlPlanEditBorder({
          req: { ...submitValue },
        }).then(({ data }) => {
          if (data.code === 200) {
            controlPlanIdFn();
            Toast('success', I18N.Factors.saveSuccessful);
          }
        });
      });
    },
  }));
  return (
    <Form form={formSix} previewTextPlaceholder='-'>
      <SchemaField schema={FormSixSchema()} />
    </Form>
  );
};
