/*
 * @@description:数据采集schema
 */

import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';

import {
  renderFormItemSchema,
  renderFromGridSchema,
} from '@/components/formily/utils';

const contentTooltipText = I18N.dashborad.videoUploadLimit;

/** 页面配置的schema */
export const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'vertical',
      },
      properties: {
        grid: {
          ...renderFromGridSchema({ columns: 1 }),
          properties: {
            sort: renderFormItemSchema({
              type: 'string',
              title: I18N.dashborad.sort,
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
              'x-component-props': {
                precision: 0,
              },
            }),
            pageName: renderFormItemSchema({
              type: 'string',
              title: I18N.dashborad.pageName,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                maxLength: 100,
              },
            }),
            content: renderFormItemSchema({
              type: 'string',
              title: I18N.carbonAccount.content,
              'x-decorator-props': {
                labelWidth: 300,
                tooltip: contentTooltipText,
                labelWrap: true,
              },
              'x-decorator': 'FormItem',
              'x-component': 'FormilyMyEditor',
              'x-component-props': {},
            }),
            pageNameEn: renderFormItemSchema({
              type: 'string',
              title: I18N.dashborad.pageNameInEnglish,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                maxLength: 100,
              },
            }),
            contentEn: renderFormItemSchema({
              type: 'string',
              title: I18N.dashborad.contentInEnglish,
              'x-decorator-props': {
                labelWidth: 300,
                tooltip: contentTooltipText,
                labelWrap: true,
              },
              'x-decorator': 'FormItem',
              'x-component': 'FormilyMyEditor',
              'x-component-props': {},
            }),
          },
        },
      },
    },
  },
};
