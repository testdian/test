import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import I18N from '@/lang/I18N';
import { Org } from '@/sdks/systemV2ApiDocs';
import { AssessmentMapOptions } from '@/utils';
import { LcaEnumResp } from '@/views/carbonFootPrintLCA/hook/type';

import { FillAssessmentRequest } from '../type';

/** 模型方案表格搜索区域  */
export const modelPlanSearchSchema = ({
  assessmentMethodOptions,
  orgList,
  assessmentAuditStatusOptions,
}: {
  assessmentMethodOptions?: AssessmentMapOptions[];
  orgList?: Org[];
  assessmentAuditStatusOptions?: LcaEnumResp[];
}): SearchProps<FillAssessmentRequest>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeModelName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonFootPrintLCA.modelName,
      }),
      modelCode: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.certificationReviewCenter.modelCoding,
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
      likePlanName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.certificationReviewCenter.planName,
      }),
      assessmentMethod: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.certificationReviewCenter.evaluationMethods,
        widget: 'select',
        enum: compact(assessmentMethodOptions?.map(v => v.value)),
        enumNames: compact(assessmentMethodOptions?.map(v => v.label)),
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
      assessmentAuditStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.supplyChainCarbonManagement.reviewStatus,
        widget: 'select',
        enum: compact(assessmentAuditStatusOptions?.map(v => String(v.code))),
        enumNames: compact(assessmentAuditStatusOptions?.map(v => v.name)),
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
    },
  };
};
