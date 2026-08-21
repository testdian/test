import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks/systemV2ApiDocs';

export const SearchSchema = (
  moduleType?: EnumResp[],
): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    likeUsername: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.operatingUserLastName,
    }),
    moduleType: xRenderSeachSchema({
      type: 'string',
      placeholder: I18N.dashborad.operationModule,
      // fixme 接口目前没有提供这里的字段
      enum: compact(moduleType?.map(k => `${k.code ?? ''}`)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      enumNames: compact(moduleType?.map(k => k.name)),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
    startDate: xRenderSeachSchema({
      type: 'string',
      props: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        showNow: false,
      },
      format: 'dateTime',
      placeholder: I18N.dashborad.startTime,
    }),
    endDate: xRenderSeachSchema({
      type: 'string',
      props: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        showNow: false,
      },
      format: 'dateTime',
      placeholder: I18N.dashborad.endTime,
    }),
  },
});
