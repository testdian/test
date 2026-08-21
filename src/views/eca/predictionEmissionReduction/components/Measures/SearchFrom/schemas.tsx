import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    displayType: 'row',
    properties: {
      likeParamName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.parameter,
        widget: 'input',
      }),
      paramCode: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.parameterId,
        widget: 'input',
      }),
    },
  };
};
