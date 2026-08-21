/*
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 16:20:36
 * @desc:lvmh项目不用该页面
 */
import { Form, FormGrid, FormItem, FormLayout, Input } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';

import style from './index.module.less';
import { schema } from './utils/schemas';
import { TextArea } from '../../component/TextArea';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    TextArea,
  },
});
const OrgInfo = () => {
  const { roleId: id, pageTypeInfo } = useParams<{
    roleId: string;
    pageTypeInfo: PageTypeInfo;
  }>();

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
    });
  }, [pageTypeInfo, id]);

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>

      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: I18N.Factors.preserve,
            type: 'primary',
            onClick: async () => {
              // return form.submit(values => {
              //   const newValue = {
              //     ...values,
              //   };
              // });
            },
          },
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
      />
    </div>
  );
};

export default OrgInfo;
