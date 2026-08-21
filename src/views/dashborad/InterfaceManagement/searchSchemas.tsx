import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks/systemV2ApiDocs';
import { SearchSchemaSelectUtils } from '@/utils/schema';

/**
 *
 * @param interfaceTypeList 接口类型枚举列表
 * @returns 接口管理搜索表单schema
 */
export const interfaceManagementSearchSchema = (
  interfaceTypeList: EnumResp[],
): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      interfaceType: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.dashborad.interfaceName,
        enum: interfaceTypeList?.map(item => `${item.code}`),
        enumNames: interfaceTypeList?.map(item => `${item.name}`),
        widget: 'select',
        props: {
          ...SearchSchemaSelectUtils,
        },
      }),
      likeBatchNo: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.dashborad.batchNumber,
      }),
      // dataTransStatus: xRenderSeachSchema({
      //   type: 'string',
      //   placeholder: I18N.dashborad.dataStatus,
      //   /**
      //    * dataTransStatus	数据同步状态。1 获取成功；2 获取失败；3 已删除,可用值:1,2,3
      //    */
      //   enum: dataTransStatusList?.map(item => `${item.code}`),
      //   enumNames: dataTransStatusList?.map(item => `${item.name}`),
      //   widget: 'select',
      //   props: {
      //     ...SearchSchemaSelectUtils,
      //   },
      // }),
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
      hasWarning: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.dashborad.hasWarning,
        /**
         * hasWarning	是否存在异常数据。0 否；1是
         */
        enum: ['1', '0'],
        enumNames: [I18N.dashborad.yes, I18N.dashborad.no],
        widget: 'select',
        props: {
          ...SearchSchemaSelectUtils,
        },
      }),
    },
  };
};
