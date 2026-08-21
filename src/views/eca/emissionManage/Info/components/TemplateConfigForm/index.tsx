/**
 * @file 模板排放源描述、模版描述表单
 */
import {
  Form,
  Input,
  Select,
  NumberPicker,
  FormItem,
  FormLayout,
  FormGrid,
  ArrayTable,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { useEffect, useMemo } from 'react';

import { TextArea } from '@/components/formily/TextArea';
import {
  handleLangFields,
  LANG_TYPE,
  reverseHandleLangFields,
  Toast,
} from '@/utils';

import { SOURCE_TYPE_MAPPING } from './constant';
import { fillSchema } from './schema';
import { editEmissionSourceDescApi } from '../../../service';
import { EmissionSourceTemplateResp } from '../../../type';

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    NumberPicker,
    Form,
    FormItem,
    FormLayout,
    FormGrid,
    ArrayTable,
    TextArea,
  },
});

export const TemplateConfigForm: React.FC<{
  isDetail?: boolean;
  /** 模版详情信息 */
  currentTemplateDetail: EmissionSourceTemplateResp;
  /** 排放源id */
  emissionSourceId: number;
  /** 操作成功 */
  onSuccess?: () => void;
}> = ({ currentTemplateDetail, emissionSourceId, isDetail, onSuccess }) => {
  const fillForm = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [currentTemplateDetail],
  );

  /** 失去焦点时更新模版描述和模版提示 */
  const handleBlur = async (
    fillDesc: string,
    fillTips: string,
    fillDescEn: string,
    fillTipsEn: string,
  ) => {
    if (emissionSourceId && currentTemplateDetail?.id) {
      const values = {
        fillDesc,
        fillTips,
        fillDescEn,
        fillTipsEn,
      };

      /** 处理多语言 */
      const languageSourceList = handleLangFields({
        rawData: values,
        langType: LANG_TYPE.EN,
        sourceTypeMapping: SOURCE_TYPE_MAPPING,
        apiLanguageSourceList: currentTemplateDetail?.languageSourceList || [],
      });

      await editEmissionSourceDescApi({
        emissionSourceId,
        id: currentTemplateDetail.id,
        fillDesc,
        fillTips,
        languageSourceList,
      });
      onSuccess?.();
    } else {
      Toast('error', I18N.eca.notObtained2);
    }
  };

  useEffect(() => {
    /** 反处理多语言 */
    const langFields = reverseHandleLangFields(
      currentTemplateDetail?.languageSourceList,
    );

    fillForm.setValues({
      fillDesc: currentTemplateDetail?.fillDesc,
      fillTips: currentTemplateDetail?.fillTips,
      ...langFields,
    });
  }, [currentTemplateDetail]);

  return (
    <Form form={fillForm} style={{ margin: '14px 14px' }}>
      <SchemaField
        schema={fillSchema({
          handleBlur: (fillDesc, fillTips, fillDescEn, fillTipsEn) => {
            handleBlur?.(fillDesc, fillTips, fillDescEn, fillTipsEn);
          },
          form: fillForm,
        })}
      />
    </Form>
  );
};
