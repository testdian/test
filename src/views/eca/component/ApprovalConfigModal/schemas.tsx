import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeSourceName: xRenderSeachSchema({
        type: 'string',
        placeholder: '排放源名称',
        widget: 'input',
      }),
      requiredAudit: xRenderSeachSchema({
        type: 'string',
        placeholder: '是否需要审批',
        widget: 'select',
        enum: [1, 0],
        enumNames: ['是', '否'],
      }),
    },
  };
};
