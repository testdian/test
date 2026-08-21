import { Form } from '@formily/core';
import I18N from '@src/lang/I18N';

import {
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderFormItemSchema,
} from '@/components/formily/utils';

/** 模板描述信息 */
export const fillSchema = ({
  handleBlur,
  form,
}: {
  handleBlur: (
    /** 排放源描述 */
    fillDesc: string,
    /** 模板描述 */
    fillTips: string,
    /** 排放源描述（英文） */
    fillDescEn: string,
    /** 模板描述（英文） */
    fillTipsEn: string,
  ) => void;
  form: Form<any>;
}) => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          columns: 4,
        }),
        properties: {
          fillDesc: renderFormItemSchema({
            title: I18N.eca.descriptionOfEmissionSources,
            'x-decorator': 'FormItem',
            'x-component': 'TextArea',
            'x-component-props': {
              maxLength: 1000,
              style: { height: 100 },
              onBlur: (e: { target: { value: string } }) => {
                if (e.target.value) {
                  handleBlur(
                    e.target.value,
                    form.getFieldState('fillTips')?.value,
                    form.getFieldState('fillDescEn')?.value,
                    form.getFieldState('fillTipsEn')?.value,
                  );
                }
              },
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          fillTips: renderFormItemSchema({
            title: I18N.eca.templateDescription,
            'x-decorator': 'FormItem',
            'x-component': 'TextArea',
            'x-component-props': {
              maxLength: 1000,
              style: { height: 100 },
              onBlur: (e: { target: { value: string } }) => {
                if (e.target.value) {
                  handleBlur(
                    form.getFieldState('fillDesc')?.value,
                    e.target.value,
                    form.getFieldState('fillDescEn')?.value,
                    form.getFieldState('fillTipsEn')?.value,
                  );
                }
              },
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          // fillDescEn: renderFormItemSchema({
          //   title: I18N.eca.descriptionOfEmissionSourcesEn,
          //   'x-decorator': 'FormItem',
          //   'x-component': 'TextArea',
          //   'x-component-props': {
          //     maxLength: 2000,
          //     style: { width: 800, height: 100 },
          //     onBlur: (e: { target: { value: string } }) => {
          //       if (e.target.value) {
          //         handleBlur(
          //           form.getFieldState('fillDesc')?.value,
          //           form.getFieldState('fillTips')?.value,
          //           e.target.value,
          //           form.getFieldState('fillTipsEn')?.value,
          //         );
          //       }
          //     },
          //   },
          // }),
          // fillTipsEn: renderFormItemSchema({
          //   title: I18N.eca.templateDescriptionEn,
          //   'x-decorator': 'FormItem',
          //   'x-component': 'TextArea',
          //   'x-component-props': {
          //     maxLength: 2000,
          //     style: { maxWidth: 800, height: 100 },
          //     onBlur: (e: { target: { value: string } }) => {
          //       if (e.target.value) {
          //         handleBlur(
          //           form.getFieldState('fillDesc')?.value,
          //           form.getFieldState('fillTips')?.value,
          //           form.getFieldState('fillDescEn')?.value,
          //           e.target.value,
          //         );
          //       }
          //     },
          //   },
          // }),
        },
      },
    },
  );
};
