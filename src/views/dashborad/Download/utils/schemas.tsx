/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-22 11:07:39
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-18 15:23:18
 */
import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

export const searchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    likeFileName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.fileName2,
    }),
    likeCreateByName: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.operator,
    }),
  },
});
