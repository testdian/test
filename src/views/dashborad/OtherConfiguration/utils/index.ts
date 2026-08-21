import { ProColumns } from '@ant-design/pro-components';

import { CodeValue, ConfigDataRow, ConfigDataRowCell } from '../type';

/**
 * 转换数据格式
 * 将 cellList 中的数据展平为对象属性
 * 例如: {id:1, cellList:[{code:'a1',value:'hhh'},{code:'a2',value:'222'}]}
 * 转换为: {id:1, a1:'hhh', a2:'222'}
 */
export const transformDataToTableDataSource = (data: ConfigDataRow[]) => {
  const newData = data.map(item => {
    const { cellList, ...rest } = item;
    const cellData: Record<string, string | undefined> = {};

    // 将 cellList 转换为对象属性
    (cellList as ConfigDataRowCell[])?.forEach(cell => {
      if (cell.code) {
        cellData[cell.code] = cell.value;
      }
    });

    return {
      ...rest,
      ...cellData,
    };
  });
  return newData;
};

/**
 * 将包含code_前缀属性的对象转换为cellList格式
 * @param data 原始数据对象
 * @returns 转换后的cellList数组
 */
export const transformDataToCellList = (
  record: ConfigDataRow,
  columns: ProColumns<ConfigDataRow>[],
): { code: string; value: any }[] => {
  return columns.map(column => {
    const dataIndex = column.dataIndex as string; // 获取列的数据索引
    return {
      code: dataIndex, // 假设 paramCode 是列的标识
      value: record[dataIndex], // 从 record 中获取对应的值
    };
  });
};

/**
 * 将表头数据转换为列配置
 * @param headerList 表头数据
 * @returns 列配置
 */
export const transformHeaderListToColumns = (
  headerList: CodeValue[],
): ProColumns<ConfigDataRow>[] => {
  return headerList.map(item => {
    return {
      title: item.value,
      dataIndex: item.code,
      width: 200,
      ellipsis: true,
      valueType: 'text',
      // formItemProps: {
      //   rules: [{ required: true, message: `请输入${item.value}` }],
      // },
    };
  });
};
