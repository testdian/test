import { ISchema } from '@formily/react';
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { Button } from '@/components/Form/Button';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { virtualLinkTransform } from '@/router/utils/enums';
import { DictTypeResp } from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { returnNoIconModalStyle, Toast } from '@/utils';

import { deleteDictTypeApi } from '../service';

export const dictColumns = ({
  refresh,
  navigate,
  onEdit,
  locale,
}: {
  refresh: TableContext['refresh'];
  onEdit: (row: DictTypeResp) => Promise<any>;
  navigate: NavigateFunction;
  locale: 'en-US' | 'zh-CN';
}): TableRenderProps<DictTypeResp>['columns'] => {
  const dictNameObj = {
    'en-US': 'dictNameLanguage',
    'zh-CN': 'dictName',
  };
  return [
    {
      title: I18N.dashborad.dictionaryName3,
      dataIndex: dictNameObj[locale],
    },
    {
      title: I18N.dashborad.dictionaryIdentification3,
      dataIndex: 'dictType',
    },
    {
      title: I18N.dashborad.dictionaryDetails,
      dataIndex: 'dictType',
      render: (v: string) => {
        return (
          <>
            {checkAuth(
              '',
              <Button
                type='link'
                onClick={async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.systemDictCategory,
                      [':id'],
                      [v],
                    ),
                  );
                }}
              >
                {I18N.dashborad.classification2}
              </Button>,
            )}
            {checkAuth(
              '',
              <Button
                type='link'
                onClick={async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.systemDictInfo,
                      [':id'],
                      [v],
                    ),
                  );
                }}
              >
                {I18N.dashborad.enum}
              </Button>,
            )}
          </>
        );
      },
    },
    {
      title: I18N.dashborad.dictionaryUsage1,
      dataIndex: 'remark',
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'id',
      render(val, row) {
        return (
          <TableActions
            menus={compact([
              checkAuth('/dicttype/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  if (row.id) onEdit(row);
                },
              }),
              checkAuth('/dicttype/edit', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    content: <span>确认删除该字典：{row.dictName}?</span>,
                    ...returnNoIconModalStyle,
                    onOk: async () => {
                      if (!row.dictType) return;
                      try {
                        await deleteDictTypeApi({
                          value: row.dictType,
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
              }),
            ])}
          />
        );
      },
    },
  ];
};

/** 数据字典搜索 schema  */
export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    dictName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.dictionaryName3,
    }),
    dictType: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.dictionaryIdentification3,
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
          dictName: {
            type: 'string',
            title: I18N.dashborad.dataDictionaryName2,
            'x-validator': [
              {
                required: true,
                message: I18N.dashborad.pleaseEnterTheDictionary2,
              },
            ],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              maxLength: 100,
              placeholder: I18N.base.pleaseEnter,
            },
          },
          dictNameLanguage: {
            type: 'string',
            title: I18N.dashborad.dataDictionaryName,
            'x-validator': [
              {
                required: true,
                message: I18N.dashborad.pleaseEnterTheDictionary2,
              },
            ],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              maxLength: 100,
              placeholder: I18N.base.pleaseEnter,
            },
          },
          dictType: {
            type: 'string',
            title: I18N.dashborad.dictionaryIdentification2,
            'x-validator': [
              {
                required: true,
                message: I18N.dashborad.pleaseEnterTheDictionary,
              },
            ],
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              maxLength: 50,
            },
          },
          remark: {
            type: 'string',
            required: false,
            title: I18N.dashborad.dictionaryUsage,
            'x-component': 'TextArea',
            'x-decorator': 'FormItem',
            'x-component-props': {
              placeholder: I18N.base.pleaseEnter,
              maxLength: 500,
              rows: 3,
            },
          },
        },
      },
    },
  };
};
