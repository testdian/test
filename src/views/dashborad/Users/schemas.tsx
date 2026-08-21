import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

/** 内部用户列表搜索表单 */
export const userSearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeUsername: xRenderSeachSchema({
        type: 'string',
        placeholder: '姓名/工号',
      }),
      likeLeader: xRenderSeachSchema({
        type: 'string',
        placeholder: '直接上级姓名/工号',
      }),
      likeDeptpath: xRenderSeachSchema({
        type: 'string',
        placeholder: '部门全称',
      }),
      likeGscompany: xRenderSeachSchema({
        type: 'string',
        placeholder: '所属单位',
      }),
      likeDingdingid: xRenderSeachSchema({
        type: 'string',
        placeholder: '钉钉ID',
      }),
      // userStatus: xRenderSeachSchema({
      //   type: 'string',
      //   width,
      //   placeholder: I18N.Factors.state,
      //   enum: userStatusEnums?.map(s => `${s.code}`),
      //   enumNames: userStatusEnums?.map(s => `${s.name}`),
      //   widget: 'select',
      //   props: {
      //     allowClear: true,
      //   },
      // }),
      userSource: xRenderSeachSchema({
        type: 'string',
        placeholder: '是否为手动新增用户',
        enum: ['1', '0'],
        enumNames: ['是', '否'],
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};

/** 外部用户列表搜索表单 */
export const externalUserSearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeUsername: xRenderSeachSchema({
        type: 'string',
        placeholder: '账号',
        widget: 'SearchInputWithNote',
        props: {
          note: '列表页在供应商名称前增加：账号，搜索项增加：账号，模糊搜索',
        },
      }),
      likeSupplierCode: xRenderSeachSchema({
        type: 'string',
        placeholder: '供应商全称/编码',
      }),
      likeEmail: xRenderSeachSchema({
        type: 'string',
        placeholder: '邮箱',
      }),
    },
  };
};
