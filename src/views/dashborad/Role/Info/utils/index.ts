export interface Tree {
  children?: Tree[]; // 子节点数组
  code?: number; // 当前节点的编码
  name?: string; // 当前节点的名称
  pcode?: number; // 父节点的编码
}

/**
 * 根据给定的节点编码找出所有父节点编码。
 * @param tree 整个树状结构，以Tree对象数组形式给出。
 * @param checkedList 需要找出父节点编码的节点编码数组。
 * @returns 返回所有给定节点编码的父节点编码数组，确保所有编码唯一。
 */
export const findParentCodes = (
  tree: Tree[],
  checkedList: number[],
): number[] => {
  // 创建一个映射，将每个节点的编码与其直接父节点的编码关联起来
  const parentMap = new Map<number, number>();

  /**
   * 递归遍历树结构，构建一个节点及其父节点的映射关系。
   * @param nodes 要遍历的Tree节点数组。
   * @param parentCode 当前遍历节点的父节点编码。
   */
  const buildParentMap = (nodes: Tree[], parentCode?: number) => {
    nodes.forEach(node => {
      if (node.code !== undefined) {
        // 将当前节点的编码与其父节点的编码关联
        if (parentCode !== undefined) {
          parentMap.set(node.code, parentCode);
        }
        // 如果当前节点有子节点，递归处理子节点
        if (node.children) {
          buildParentMap(node.children, node.code);
        }
      }
    });
  };

  // 从根节点开始初始化映射（根节点没有父编码）
  buildParentMap(tree);

  // 创建一个集合，用于存储在过程中找到的所有父节点编码
  const parentCodes = new Set<number>();

  /**
   * 从指定节点编码开始，递归地将父节点编码添加到集合中。
   * @param code 起始节点编码。
   */
  const addParentCodes = (code: number) => {
    const parentCode = parentMap.get(code);
    if (parentCode !== undefined) {
      parentCodes.add(parentCode);
      // 继续向上级添加父节点编码
      addParentCodes(parentCode);
    }
  };

  // 遍历每个被检查的编码，将其父节点编码添加到集合中
  checkedList.forEach(code => {
    addParentCodes(code);
  });

  // 将父节点编码集合转换为数组后返回
  return Array.from(parentCodes);
};
