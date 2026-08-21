import { ProColumns } from '@ant-design/pro-components';

import { ComputationTemplateResp, FillDataRow, RowCell } from '../type';

/** 定义方法，将cellList数据转换为表格数据  */
export const transformDataToTableDataSource = (
  data: FillDataRow,
  columns: ProColumns<ComputationTemplateResp>[],
  /** 用其他字段填充 value */
  cellFiled?: string,
) => {
  return data.map(
    (item: {
      repeatFlag: boolean;
      id: number;
      factorId?: string;
      factorName?: string;
      factorValue?: string;
      factorList?: {
        factorId: string;
        factorName: string;
        factorValue: string;
        unit: string;
      }[];
      unit?: string;
      dataValue?: string;
      cellList: { code: string; value: string; warningFlag?: boolean }[];
      attachmentUrl?: string;
    }) => {
      const rowData: Record<string, any> = { id: item.id };
      // 创建一个 code 到 cell 的映射
      const cellMap =
        item.cellList?.reduce?.<Record<string, RowCell>>((acc, cell) => {
          if (cell.code) {
            acc[`${cell.code}`] = cell;
          }
          return acc;
        }, {}) || {};

      // 使用 columns 状态来建立对应关系
      columns?.forEach?.(column => {
        const cell = cellMap[column.dataIndex as string];

        if (cell) {
          if (cellFiled) {
            rowData[column.dataIndex as string] = cell[cellFiled];
            rowData[`${column.dataIndex}_warningFlag`] = cell.warningFlag;
          } else {
            rowData[column.dataIndex as string] = cell.value;
            rowData[`${column.dataIndex}_warningFlag`] = cell.warningFlag;
          }
        }
      });

      // 添加 factorId, factorName, factorValue 到 rowData
      rowData.factorId = item.factorId || item.factorList?.[0]?.factorId;
      rowData.factorName = item.factorName || item.factorList?.[0]?.factorName;
      rowData.factorValue =
        item.factorValue || item.factorList?.[0]?.factorValue;
      rowData.unit = item.unit || item.factorList?.[0]?.unit;
      rowData.factorList = item.factorList;
      rowData.dataValue = item.dataValue;
      rowData.repeatFlag = item.repeatFlag;
      rowData.attachmentUrl = item.attachmentUrl;
      return rowData;
    },
  );
};

/**
 * 将包含code_前缀属性的对象转换为cellList格式
 * @param data 原始数据对象
 * @returns 转换后的cellList数组
 */
export const transformDataToCellList = (
  record: FillDataRow,
  columns: ProColumns<ComputationTemplateResp>[],
): { code: string; value: any }[] => {
  return columns.map(column => {
    const dataIndex = column.dataIndex as string; // 获取列的数据索引
    return {
      code: dataIndex, // 假设 paramCode 是列的标识
      value: record[dataIndex], // 从 record 中获取对应的值
    };
  });
};
