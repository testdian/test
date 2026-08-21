/**
 * @description 连接图
 */

import { Graph, GraphData } from '@antv/g6';
import { useEffect, useRef } from 'react';

import style from './index.module.less';
import { NODE_TYPE } from '../IndustrialProcessFlowDiagram/until';

const { PRECURSOR } = NODE_TYPE;

const ProcessStructureDiagram = ({ data }: { data?: GraphData }) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current || !data) return;

    const width = graphRef.current.offsetWidth;
    const height = graphRef.current.offsetHeight;

    const graph = new Graph({
      container: graphRef.current,
      width,
      height,
      autoFit: 'view',
      data,
      background: '#f7f8f9',
      node: {
        type: 'rect',
        style: {
          labelText: d => d?.label as string,
          labelPlacement: 'center',
          labelFontSize: 10,
          labelWordWrap: true,
          labelMaxWidth: '90%',
          labelMaxLines: 2,
          labelTextOverflow: 'ellipsis',
          labelLeading: -3,
          labelFill: '#ffffff',
          size: [80, 40],
          radius: 8,
          fill: d => (d.isProcess === PRECURSOR ? '#E66A6C' : '#5B8FF9'),
        },
      },
      edge: {
        type: 'polyline',
        style: {
          sourcePort: 'bottom',
          targetPort: 'top',
          endArrow: true,
        },
      },
      layout: {
        type: 'antv-dagre',
        ranksep: 60,
        nodesep: 40,
        preventOverlap: true,
      },
      plugins: [
        {
          type: 'tooltip',
          getContent: (_e: any, items: { label: string }[]) => {
            let result = ``;
            items.forEach(item => {
              result += `<p>${item.label || '-'}</p>`;
            });
            return result;
          },
        },
      ],
      behaviors: [
        'drag-element',
        'drag-canvas',
        'zoom-canvas',
        'hover-activate',
        {
          type: 'hover-activate',
          degree: 1,
        },
      ],
    });

    graph.render();
  }, []);

  return (
    <div className={style.graphBoxMain}>
      <div className={style.graphBox} ref={graphRef} />
    </div>
  );
};

export default ProcessStructureDiagram;
