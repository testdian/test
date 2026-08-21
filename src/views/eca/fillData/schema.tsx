import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { OrgTree } from '@/hooks/useOrgTreeData/type';
import I18N from '@/lang/I18N';
import { getYear } from '@/utils';

import { DATA_COLLECTION_PERIOD_OPTIONS } from '../carbonMissionAccounting/component/FillingDeadlineModal/schemas';
import { fillStatusOptions } from '../carbonMissionAccounting/config';
import { EnumOptionResp } from '../hooks';

export const schema = ({
  GHGCategoryArr,
  orgTreeData,
}: {
  GHGCategoryArr: EnumOptionResp[];
  orgTreeData: OrgTree[];
}) => {
  return {
    type: 'object',
    properties: {
      likeSourceName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.emissionSourceName,
      }),
      orgCode: xRenderSeachSchema({
        placeholder: '核算组织',
        type: 'string',
        widget: 'TreeSelect',
        props: {
          treeData: orgTreeData,
          treeDefaultExpandAll: true,
          showSearch: true,
          allowClear: true,
          treeNodeFilterProp: 'label',
        },
      }),
      dataPeriod: xRenderSeachSchema({
        type: 'array',
        placeholder: '数据收集周期',
        widget: 'cascader',
        props: {
          changeOnSelect: true,
          options: DATA_COLLECTION_PERIOD_OPTIONS,
          showSearch: true,
          expandTrigger: 'hover',
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      year: xRenderSeachSchema({
        placeholder: I18N.components.accountingYear,
        type: 'string',
        widget: 'Select',
        enum: getYear().map(item => `${item}`),
        props: {
          showSearch: true,
          allowClear: true,
          optionFilterProp: 'label',
        },
      }),
      ghg: xRenderSeachSchema({
        placeholder: I18N.eca.ghgClassification3,
        type: 'string',
        widget: 'Cascader',
        props: {
          options: GHGCategoryArr,
        },
      }),
      fillStatus: xRenderSeachSchema({
        placeholder: I18N.cbam.fillInStatus,
        type: 'string',
        widget: 'Select',
        props: {
          options: fillStatusOptions?.filter(item => item.value),
          allowClear: true,
        },
      }),
    },
  };
};
