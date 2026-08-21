import { GraphData } from '@antv/g6';

import { EdgeResultDTO } from '@/views/certificationReviewCenter/cbam/ReportForm/type';

/** 节点类型 */
export const NODE_TYPE = {
  /** 工序 */
  PROCESS: 0,
  /** 前体 */
  PRECURSOR: 1,
};

/** 转换流程图数据 */
export const transformData = (initData: EdgeResultDTO) => {
  if (!initData) return undefined;

  const initNodes = initData?.nodes || [];
  const initEdges = initData?.edges || [];

  if (initNodes?.length === 0) return undefined;

  const nodes = initNodes;

  const edges = initEdges?.map((edge, index) => {
    const source = edge?.source;
    const target = edge?.target;
    const sourceLabel = initNodes?.find(node => node.id === source)?.label;
    const targetLabel = initNodes?.find(node => node.id === target)?.label;

    return {
      id: `${index}${source}${target}`,
      source,
      target,
      label: `${sourceLabel} --> ${targetLabel}`,
    };
  });

  return {
    nodes,
    edges,
  } as GraphData;
};
