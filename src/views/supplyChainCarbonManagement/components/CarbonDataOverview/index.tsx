/**
 * @description: 碳数据概览（供应商碳数据、碳数据审核）
 */
import { Form, FormGrid, FormItem, FormLayout, Input } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { useEffect, useMemo } from 'react';

import { infoSchema } from './utils/schemas';
import { CarbonDataPropsType } from '../../utils/type';

function CarbonDataOverview({ cathRecord }: CarbonDataPropsType) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  const form = useMemo(
    () =>
      createForm({
        readPretty: true,
      }),
    [],
  );

  /** 详情数据 */
  useEffect(() => {
    if (cathRecord) {
      form.setValues({
        ...cathRecord,
      });
    }
  }, [cathRecord]);

  return (
    <Form form={form} previewTextPlaceholder='-'>
      <SchemaField schema={infoSchema()} />
    </Form>
  );
}
export default CarbonDataOverview;
