import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import I18N from '@/lang/I18N';
import { Org } from '@/sdks/systemV2ApiDocs';
import { FillAssessmentRequest } from '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonFootPrintFill/type';

export const searchSchema = ({
  orgList,
}: {
  orgList?: Org[];
}): SearchProps<FillAssessmentRequest>['schema'] => {
  return {
    type: 'object',
    properties: {
      cbamName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.cbam.reportName,
      }),
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonData.affiliatedOrganization,
        enum: compact(orgList?.map(u => String(u.id))),
        enumNames: compact(orgList?.map(u => u.orgName)),
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
