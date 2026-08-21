import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

/** 搜索表单 */
export const searchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      changeLog: xRenderSeachSchema({
        type: 'string',
        placeholder: '变更说明',
      }),
    },
  };
};
