/** 顶部搜索表单类型 */
export type TopSearchFormType = {
  includeChild: boolean;
  orgId: number;
};

/** 各组件共用参数类型 */
export type CommonProps = {
  topSearchFormValues: TopSearchFormType;
  selectOrgName?: string;
};

/** 排放强度组件参数类型 */
export type IntensityProps = CommonProps & {
  metricsOptions: {
    label: string;
    value?: number;
    unit?: string;
  }[];
};

/** 组织option类型 */
export type OrgOptionType = {
  label: string | undefined;
  value: number | undefined;
};
