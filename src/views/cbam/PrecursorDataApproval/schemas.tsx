import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

import { PrecursorDataApprovalListRequest } from './type';

export const searchSchema = ({
  applyStatusOptions,
}: {
  applyStatusOptions?: EnumResp[];
}): SearchProps<PrecursorDataApprovalListRequest>['schema'] => {
  return {
    type: 'object',
    properties: {
      preName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.cbam.nameOfPrecursor,
      }),
      supplyName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonFootPrint.supplierName,
      }),
      applyStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.supplyChainCarbonManagement.fillInTheApprovalForm,
        enum: compact(applyStatusOptions?.map(v => String(v.code))),
        enumNames: compact(applyStatusOptions?.map(v => v?.name)),
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
