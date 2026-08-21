// hooks/useOrganizationSelect.ts
import I18N from '@src/lang/I18N';
import { SchemaBase } from 'form-render';

import { useLvmhOrgsType } from '@/hooks/eca';

type OrgOption = {
  label: string;
  value: string;
};

/** 这是获取组织选择器配置 带有一级组织的数据 */
export const useOrganizationSelect = (): {
  getBrandOrgOptions: () => OrgOption[];
  getSearchSchema: () => SchemaBase;
} => {
  const brands = useLvmhOrgsType();
  return {
    /** 生成antd Select需要的枚举格式 */
    getBrandOrgOptions: () =>
      brands?.map(org => ({
        label: org?.value,
        value: org?.code,
      })) || [],

    /** 生成xRender搜索schema */
    getSearchSchema: () => ({
      widget: 'select',
      enum: brands?.map(org => org.code),
      enumNames: brands?.map(org => org?.value),
      props: {
        allowClear: true,
        showSearch: true,
        placeholder: I18N.carbonData.affiliatedOrganization,
        filterOption: (input: string, option: any) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
      },
    }),
  };
};
