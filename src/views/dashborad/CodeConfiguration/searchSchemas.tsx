import I18N from '@src/lang/I18N';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

/**
 *
 * @returns 接口配置搜索表单schema
 */
export const codeConfigurationSearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      code: xRenderSeachSchema({
        type: 'number',
        placeholder: 'Code',
        props: {
          controls: false,
        },
      }),
      likeCodeDesc: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.dashborad.chineseAndEnglishDescription,
      }),
      likeScene: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.Factors.applicableScenarios,
      }),
      codeType: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonFootPrintLCA.type,
        /** 1 数据校验；2 错误码, */
        enum: [1, 2],
        enumNames: [I18N.dashborad.dataCheck, I18N.dashborad.errorCode],
        widget: 'select',
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
    },
  };
};
