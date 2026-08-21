import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { getYear } from '@/utils';

import { ConfigurationRequest } from './type';

export const schema = (): SearchProps<ConfigurationRequest>['schema'] => {
  return {
    type: 'object',
    properties: {
      year: xRenderSeachSchema({
        placeholder: '核算年份',
        type: 'string',
        widget: 'Select',
        enum: getYear().map(item => `${item}`),
        props: {
          showSearch: true,
          allowClear: true,
          optionFilterProp: 'label',
        },
      }),
      likeMainParamName: xRenderSeachSchema({
        type: 'string',
        placeholder: '主要参数名称',
      }),
      likeAssociatedParamName: xRenderSeachSchema({
        type: 'string',
        placeholder: '关联参数名称',
      }),
    },
  };
};
