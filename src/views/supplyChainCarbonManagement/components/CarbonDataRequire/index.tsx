/**
 * @description 数据请求/数据要求 （供应商核算数据、供应商数据审批、供应商数据填报）
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Cascader,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { useEffect, useMemo } from 'react';

import { FormilyFileUpload } from '@/components/FormilyFileUpload';
import { changeFactorM2cascaderOptions } from '@/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { productInfoSchema } from './schemas';
import { TypeApplyInfoResp, UploadFile } from '../../utils/type';

function CarbonDataRequire({
  /** 模块的类型 fill 为填报页面 */
  currentModalType,
  /** 数据详情 */
  cathRecord,
}: {
  /** 数据详情 */
  cathRecord?: TypeApplyInfoResp;
  /** 模块类型 */
  currentModalType?: string;
}) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      TextArea,
      Cascader,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      FormilyFileUpload,
    },
  });

  /** 核算单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 是否为碳数据填报页面 */
  const isFill = currentModalType === 'fill';

  const form = useMemo(
    () =>
      createForm({
        readPretty: true,
      }),
    [],
  );

  /** 设置枚举值 */
  useEffect(() => {
    /** 核算单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [accountsUnitsList]);

  useEffect(() => {
    if (cathRecord) {
      const { supportFile } = cathRecord;

      /** 支撑材料 */
      let supportMaterialsFileList = [];
      if (supportFile && typeof supportFile === 'string') {
        try {
          const parsedFileData = JSON.parse(supportFile) || [];
          supportMaterialsFileList = parsedFileData?.map((file: UploadFile) => {
            const { fileName, fileId, fileUrl } = file || {};
            return {
              ...file,
              name: fileName,
              uid: fileId,
              url: fileUrl,
            };
          });
        } catch (error) {
          // 防止脏数据导致页面空白
        }
      } else {
        supportMaterialsFileList = [];
      }

      /** 表单赋值 */
      form.setValues({
        ...cathRecord,
        supportFile: supportMaterialsFileList,
      });
    }
  }, [cathRecord]);

  return (
    <Form form={form} previewTextPlaceholder='-'>
      <SchemaField schema={productInfoSchema(isFill)} />
    </Form>
  );
}
export default CarbonDataRequire;
