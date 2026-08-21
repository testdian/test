import { ProTable } from '@ant-design/pro-components';
import React, { useMemo } from 'react';

import style from './index.module.less';
import { EmissionSourceParam } from '../../../type';
import { generateTableConfig } from '../../utils/generateTableConfig';

interface ParamsTableProps {
  /** 已选择的模板参数数据 */
  paramsData: EmissionSourceParam[];
  paramsTitle?: string;
}

const ParamsTable: React.FC<ParamsTableProps> = ({
  paramsData,
  paramsTitle,
}) => {
  // 使用 useMemo 缓存计算结果，避免重复计算，并确保 columns 和 dataSource 使用同一次计算结果
  const tableConfig = useMemo(() => {
    return generateTableConfig(paramsData || []);
  }, [paramsData]);

  // 生成唯一的 key，当数据顺序变化时强制重新渲染表格
  const tableKey = useMemo(() => {
    return paramsData?.map(item => item.paramCode).join('-') || 'empty';
  }, [paramsData]);

  return (
    <div className={style.paramsTable}>
      <h4>{paramsTitle}</h4>
      <ProTable<EmissionSourceParam>
        key={tableKey}
        size='small'
        // @ts-ignore
        columns={tableConfig?.columns}
        dataSource={tableConfig?.dataSource}
        rowKey='id'
        search={false}
        pagination={false}
        options={false}
        scroll={{ x: 1000, y: 55 * 10 }}
        toolBarRender={false}
      />
    </div>
  );
};

export default ParamsTable;
