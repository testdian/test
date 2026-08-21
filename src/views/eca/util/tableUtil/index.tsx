import { Table } from 'antd';

import { generateParamFormatComponent } from '@/views/eca/emissionManage/Info/utils/generateTableConfig';
import { ComputationTemplateResp } from '@/views/eca/fillData/type';

export const baseTableConfig = {
  size: 'small',
  scroll: {
    x: 1000,
    y: 55 * 9,
  },
  pagination: {
    showSizeChanger: true,
    showTotal: undefined,
    size: 'small',
  },
  recordCreatorProps: false,
};

/** 生成参数的配置表格信息 */
export const generateParamsSummary = (
  paramList: ComputationTemplateResp['paramList'],
  options: {
    showFactor?: boolean;
    showCheckbox?: boolean;
    showOperation?: boolean;
    showAttachment?: boolean;
  } = {},
) => {
  const {
    showFactor = true,
    showCheckbox = false,
    showOperation = false,
    showAttachment = false,
  } = options;

  // 计算基础索引偏移量
  const baseIndexOffset = showCheckbox ? 1 : 0;

  // 生成参数单元格列表
  const paramCells =
    paramList?.map((param, index) => (
      <Table.Summary.Cell key={param.id} index={baseIndexOffset + index}>
        {generateParamFormatComponent(param)}
      </Table.Summary.Cell>
    )) || [];

  // 生成额外单元格列表
  const extraCells = [];
  const factorIndex = paramList?.length || 0;

  // 动态计算当前列索引
  let currentIndex = baseIndexOffset + factorIndex;

  if (showFactor) {
    extraCells.push(
      <Table.Summary.Cell key='factor' index={currentIndex}>
        -
      </Table.Summary.Cell>,
      <Table.Summary.Cell key='emission' index={currentIndex + 1}>
        -
      </Table.Summary.Cell>,
      <Table.Summary.Cell key='emission' index={currentIndex + 2}>
        -
      </Table.Summary.Cell>,
    );
    currentIndex += 3;
  }

  if (showOperation) {
    extraCells.push(
      <Table.Summary.Cell key='operation' index={currentIndex}>
        -
      </Table.Summary.Cell>,
    );
    currentIndex += 1;
  }

  if (showAttachment) {
    extraCells.push(
      <Table.Summary.Cell key='attachment' index={currentIndex}>
        -
      </Table.Summary.Cell>,
    );
  }

  return (
    <Table.Summary fixed='top'>
      <Table.Summary.Row>
        {showCheckbox && <Table.Summary.Cell key='checkbox' index={0} />}
        {paramCells}
        {extraCells}
      </Table.Summary.Row>
    </Table.Summary>
  );
};
