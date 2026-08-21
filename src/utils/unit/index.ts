/** 单位处理判断方法 */
export const handleUnitCode = (unitCode: string | null | undefined) =>
  Array.isArray(unitCode) ? String(unitCode) : unitCode || '';
