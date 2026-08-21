/**
 * 判断传入的参数是否存在且是数组类型并且长度不为0
 * @param value 要检查的值
 * @returns 如果值存在、是数组且长度不为0则返回true，否则返回false
 */
export const isValidArray = (value: any): boolean => {
  return value && Array.isArray(value) && value.length > 0;
};

/**
 * 判断传入的参数是否存在且是数组类型
 * @param value 要检查的值
 * @returns 如果值存在且是数组则返回true，否则返回false
 */
export const isArray = (value: any): boolean => {
  return value && Array.isArray(value);
};

/**
 * 判断传入的参数是否存在且是数组类型并且长度不为0（类型安全版本）
 * @param value 要检查的值
 * @returns 如果值存在、是数组且长度不为0则返回true，否则返回false
 */
export const isValidArrayWithType = <T>(value: any): value is T[] => {
  return value && Array.isArray(value) && value.length > 0;
};
