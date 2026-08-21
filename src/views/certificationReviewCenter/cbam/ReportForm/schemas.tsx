import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

import { CbamRequest } from './type';

export const searchSchema = (): SearchProps<CbamRequest>['schema'] => {
  return {
    type: 'object',
    properties: {
      cbamName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.cbam.reportName,
      }),
      factoryName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.cbam.factoryName,
      }),
    },
  };
};
