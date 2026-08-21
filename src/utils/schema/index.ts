/** select组件搜索配置 */
export const SearchSchemaSelectUtils = {
  allowClear: true,
  showSearch: true,
  filterOption: (input: string, option: { label: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
};
