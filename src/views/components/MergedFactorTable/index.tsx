import { ProTable } from '@ant-design/pro-components';
import { useState } from 'react';

import { FullPageDetail } from '@/views/Factors/FullPageDetail';
import { EmissionSourceFactorResp } from '@/views/eca/emissionManage/type';

import { factorColumns } from './columns';

import './index.less';

const MergedFactorTable = ({ item }: { item: EmissionSourceFactorResp }) => {
  const [factorDetailModalOpen, setFactorDetailModalOpen] = useState(false);
  const [checkFactorId, setCheckFactorId] = useState('');
  const paramNames = new Set<string>();
  if (item.factorList) {
    item.factorList.forEach(factor => {
      factor?.paramValueList?.forEach?.(param => {
        paramNames.add(param.paramName);
      });
    });
  }

  const paramNamesArray = Array.from(paramNames);

  const dataSource: any[] = [];
  if (item.factorList) {
    item.factorList?.forEach?.(factor => {
      const row: any = {
        ...factor,
        factorName: factor.factorName,
      };
      paramNamesArray.forEach(paramName => {
        const paramValue =
          factor?.paramValueList?.find?.(param => param.paramName === paramName)
            ?.valueName || '';
        row[`paramValue_${paramName}`] = paramValue;
      });
      dataSource.push(row);
    });
  }

  const onFactorClick = (factorId: string) => {
    setFactorDetailModalOpen(true);
    setCheckFactorId(factorId);
  };

  return (
    <div className='merged-factor-table'>
      <h4>{item?.mainParamName || ''}</h4>
      <ProTable
        search={false}
        size='small'
        toolBarRender={false}
        rowKey='id'
        scroll={{ y: 55 * 5 }}
        columns={factorColumns(onFactorClick, paramNamesArray)}
        dataSource={dataSource}
        pagination={false}
      />
      <FullPageDetail
        open={factorDetailModalOpen}
        onClose={() => {
          setFactorDetailModalOpen(false);
        }}
        initFactorId={checkFactorId || ''}
        defaultApi
      />
    </div>
  );
};

export default MergedFactorTable;
