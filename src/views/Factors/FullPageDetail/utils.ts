import { gasEnumsMap } from '../Info/utils';

/**
 * 根据gasType获取对应枚举值
 * @param gasType 气体类型（示例："六氟化硫（SF₆）"）
 * @param factorUnitZ 需要匹配的字典值
 * @param enums 枚举集合
 */
export const getGasEnumLabel = (
  gasType: string,
  factorUnitZ: string,
  enums: Record<string, Array<{ dictValue: string; dictLabel: string }>>,
): string => {
  // 1. 提取括号内的气体标识（如SF₆）
  const gasKeyMatch = gasType.match(/（([^)]+)）/);
  if (!gasKeyMatch) return '-';

  // 2. 获取气体标识符（去掉括号内容）
  const gasKey = gasKeyMatch[1].replace(')', '').trim();

  // 3. 查找对应的枚举类别
  const enumKey = Object.keys(gasEnumsMap).find(key => key.includes(gasKey)) as
    | keyof typeof gasEnumsMap
    | undefined;

  if (!enumKey) return '-';

  // 4. 获取对应枚举数组
  const enumCategory = gasEnumsMap[enumKey];
  const enumList = enums?.[enumCategory] || [];

  // 5. 匹配具体枚举项
  const targetEnum = enumList.find(item => item.dictValue === factorUnitZ);

  return targetEnum?.dictLabel || '-';
};
