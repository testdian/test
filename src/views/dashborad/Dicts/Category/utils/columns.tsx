/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-08 14:41:42
 */

import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { Button } from '@/components/Form/Button';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { DictDataResp } from '@/sdks/systemV2ApiDocs';

export const dictColumns = ({
  onEdit,
  locale,
}: {
  onEdit: (row: DictDataResp) => Promise<any>;
  locale: 'en-US' | 'zh-CN';
}): TableRenderProps<DictDataResp>['columns'] => {
  const dictLabelObj = {
    'en-US': 'dictLabelLanguage',
    'zh-CN': 'dictLabel',
  };
  return [
    {
      title: I18N.dashborad.classificationName,
      dataIndex: dictLabelObj[locale],
    },
    {
      title: I18N.dashborad.classificationIdentification,
      dataIndex: 'dictValue',
    },
    {
      title: I18N.dashborad.sort,
      dataIndex: 'dictSort',
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'id',
      render(val, row) {
        return (
          <Button
            type='link'
            onClick={async () => {
              onEdit(row);
            }}
          >
            {I18N.Factors.edit}
          </Button>
        );
      },
    },
  ];
};

/** 数据字典搜索 schema  */
export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    dictLabel: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.pleaseEnterACategory2,
    }),
    dictValue: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.pleaseEnterACategory,
    }),
  },
});

/** 数据字典 schema  */
export const dictAddSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          dictLabel: {
            type: 'string',
            title: I18N.dashborad.inTheClassificationName,
            'x-validator': [
              { required: true, message: I18N.dashborad.pleaseEnterACategory2 },
            ],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              maxLength: 100,
            },
          },
          dictLabelLanguage: {
            type: 'string',
            title: I18N.dashborad.classificationNameInEnglish,
            'x-validator': [
              { required: true, message: I18N.dashborad.pleaseEnterACategory2 },
            ],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              maxLength: 100,
            },
          },
          dictValue: {
            type: 'string',
            title: I18N.dashborad.classificationIdentification,
            'x-validator': [
              { required: true, message: I18N.dashborad.pleaseEnterACategory },
            ],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              maxLength: 50,
            },
          },
          dictSort: {
            type: 'number',
            title: I18N.dashborad.sort,
            'x-validator': [
              { required: true, message: I18N.dashborad.pleaseEnterSorting },
            ],
            'x-component': 'NumberPicker',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              min: 0,
              max: 99999,
              step: 1,
              precision: 0,
            },
          },
        },
      },
    },
  };
};
