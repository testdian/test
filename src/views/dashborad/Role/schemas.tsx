import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Role } from '@/sdks/systemV2ApiDocs';

export const searchSchema = ({
  roleList,
}: {
  roleList: Role[];
}): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      id: xRenderSeachSchema({
        type: 'string',
        placeholder: '角色名称',
        enum: roleList?.map(role => `${role.id}`),
        enumNames: roleList?.map(role => `${role.roleName}`),
        widget: 'select',
        props: {
          allowClear: true,
          showSearch: true,
          optionFilterProp: 'label',
        },
      }),
    },
  };
};
