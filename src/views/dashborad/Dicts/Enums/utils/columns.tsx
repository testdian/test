/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-22 17:06:27
 */

import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { DictDataResp } from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { returnNoIconModalStyle, Toast } from '@/utils';
import { SearchSchemaSelectUtils } from '@/utils/schema';

import {
  deleteEnumApi,
  DictEnumStatus,
  enableDisableEnumApi,
} from '../service';

const { Enable, Disable } = DictEnumStatus;

/** 品牌分类标识 */
const BrandFlag = 'brandType';

export type TypeLanuageDictTypeResp = {
  [key: string]: any;
  'en-US': string;
  'zh-CN': string;
  // 其他属性...
};
export const dictColumns = ({
  locale,
  onEdit,
  refresh,
}: {
  locale: 'en-US' | 'zh-CN';
  onEdit: (row: DictDataResp) => Promise<any>;
  refresh: TableContext['refresh'];
}): TableRenderProps<
  DictDataResp & { status: 0 | 1; sourceType: string }
>['columns'] => {
  const dictLabelObj = {
    'en-US': 'dictLabelLanguage',
    'zh-CN': 'dictLabel',
  };
  const sourceTypeNameObj = {
    'en-US': 'sourceTypeNameLanguage',
    'zh-CN': 'sourceTypeName',
  };
  return [
    {
      title: I18N.dashborad.enumerationValueName,
      dataIndex: dictLabelObj[locale],
    },
    {
      title: I18N.dashborad.enumerationValueIdentification,
      dataIndex: 'dictValue',
    },
    {
      title: I18N.dashborad.associatedValue,
      dataIndex: 'relatedValue',
    },
    {
      title: I18N.dashborad.sort,
      dataIndex: 'dictSort',
    },
    {
      title: I18N.dashborad.classification,
      dataIndex: sourceTypeNameObj[locale],
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'actions',
      render(val, row) {
        const { id, sourceType } = row;
        return (
          <TableActions
            menus={compact([
              {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: () => onEdit(row),
              },
              {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    content: (
                      <span>确认删除该枚举值：{dictLabelObj[locale]}?</span>
                    ),
                    ...returnNoIconModalStyle,
                    onOk: async () => {
                      if (!row.id) return;
                      try {
                        await deleteEnumApi({
                          id: row.id,
                        });
                        Toast('success', I18N.Factors.deleteSuccessful);
                        refresh?.({ stay: true, tab: 1 });
                      } catch (error) {
                        //
                      }
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              },
              sourceType === BrandFlag && {
                label:
                  Number(row?.status) === 0
                    ? I18N.Factors.disabled
                    : I18N.Factors.enable,
                key: I18N.Factors.edit,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    content:
                      Number(row?.status) === Enable
                        ? I18N.template(I18N.dashborad.doYouWantToDisableThis, {
                            val1: row?.dictLabel,
                          })
                        : I18N.template(I18N.dashborad.doYouWantToDisableThis, {
                            val1: row?.dictLabel,
                          }),
                    onOk: async () => {
                      if (Number(row?.status) === Enable) {
                        await enableDisableEnumApi({
                          id: Number(id),
                          status: Disable,
                        });
                      } else {
                        await enableDisableEnumApi({
                          id: Number(id),
                          status: Enable,
                        });
                      }
                      refresh?.({ stay: true, tab: 1 });
                    },
                    okText: I18N.utils.ok,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              },
            ])}
          />
        );
      },
    },
  ];
};

/** 数据字典搜索 schema  */
export const dictSearchSchema = ({
  dictSourceType,
}: {
  dictSourceType: DictDataResp[];
}): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    dictLabel: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.pleaseEnterAnEnumeration3,
    }),
    dictValue: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.pleaseEnterAnEnumeration,
    }),
    sourceType: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.pleaseSelectTheAffiliation,
      enum: dictSourceType.map(d => d.dictValue as string),
      enumNames: dictSourceType.map(d => d.dictLabel as string),
      widget: 'select',
      props: {
        ...SearchSchemaSelectUtils,
      },
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
            title: I18N.dashborad.inTheEnumerationName,
            'x-validator': [
              {
                required: true,
                message: I18N.dashborad.pleaseEnterAnEnumeration2,
              },
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
            title: I18N.dashborad.enumerationNameInEnglish,
            'x-validator': [
              {
                required: true,
                message: I18N.dashborad.pleaseEnterAnEnumeration2,
              },
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
            title: I18N.dashborad.enumerationValueIdentification,
            'x-validator': [
              {
                required: true,
                message: I18N.dashborad.pleaseEnterAnEnumeration,
              },
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
          relatedValue: {
            type: 'string',
            title: I18N.dashborad.associatedValue,
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              maxLength: 100,
            },
          },
          sourceType: {
            type: 'string',
            title: I18N.dashborad.classification,
            'x-validator': [
              {
                required: true,
                message: I18N.dashborad.pleaseEnterTheAffiliation,
              },
            ],
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.Factors.pleaseSelect,
              ...SearchSchemaSelectUtils,
            },
          },
        },
      },
    },
  };
};
