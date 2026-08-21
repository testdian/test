import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { SearchSchemaSelectUtils } from '@/utils/schema';
import { emailSendStatusOptions } from '@/views/eca/carbonMissionAccounting/config';

/**
 *
 * @returns 邮件发送记录搜索表单schema
 */
export const emailSendingRecordSearchSchema =
  (): SearchProps<any>['schema'] => {
    return {
      type: 'object',
      properties: {
        likeSubject: xRenderSeachSchema({
          type: 'string',
          placeholder: I18N.dashborad.subject,
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
        emailStatus: xRenderSeachSchema({
          type: 'string',
          placeholder: I18N.dashborad.sendStatus,
          enum: emailSendStatusOptions?.map(item => item.value.toString()),
          enumNames: emailSendStatusOptions?.map(item => item.label),
          widget: 'select',
          props: {
            ...SearchSchemaSelectUtils,
          },
        }),
      },
    };
  };
