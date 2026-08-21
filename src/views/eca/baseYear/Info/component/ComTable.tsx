/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-26 12:39:07
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-16 18:29:36
 */
import { Field } from '@formily/core';
import { useField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { InputNumber, Table } from 'antd';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
// import { Toast } from '@/utils';
import { RegChectDoit3 } from '@/views/eca/util/util';

export const ComTable = () => {
  const { pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo & 'copy';
  }>();
  const filed = useField<Field>();
  const computTotal = (record: any, index: number) => {
    // let value = 0;
    // 计算排放总量
    if (record.scopeOne || record.scopeTwo || record.scopeThree) {
      // @ts-ignore
      filed.value[index].total = (
        Number(record.scopeOne || 0) +
        Number(record.scopeTwo || 0) +
        Number(record.scopeThree || 0)
      )
        .toFixed(3)
        .replace(/\.?0+$/, '');
    } else if (
      record.direct ||
      record.energy ||
      record.transport ||
      record.outsourcing ||
      record.supplyChain ||
      record.rests
    ) {
      // @ts-ignore
      filed.value[index].total = // @ts-ignore
        (
          Number(record.direct || 0) +
          // @ts-ignore
          Number(record.energy || 0) +
          Number(record.transport || 0) +
          Number(record.outsourcing || 0) +
          Number(record.supplyChain || 0) +
          Number(record.rests || 0)
        )
          .toFixed(3)
          .replace(/\.?0+$/, '');
    } else {
      filed.value[index].total = 0;
    }
    // filed.value[index].total = record;
    filed.setValue([...filed.value]);
    // dataSource[index] = record;
    // setDataSource([...dataSource]);
  };
  const valueChangeFn = (
    value: string | null,
    index: number,
    record: [],
    key: string,
  ) => {
    if (!RegChectDoit3.test(value || '')) {
      // Toast('error', '支持小数点后三位');
    } else {
      filed.value[index][key] =
        Number(value) >= 0 ? Number(value).toFixed(3) : null;
      computTotal(record, index);
    }
  };

  const culDisAbled = () => {
    // 编辑页面  特殊处理 更新数据在进行判断
    if (window.location.pathname.indexOf('edit') >= 0) {
      return false;
    }
    if (window.location.pathname.indexOf('add') >= 0) {
      return false;
    }
    return true;
  };
  return (
    <div>
      <Table
        columns={[
          {
            title: I18N.eca.timeInterval,
            width: 140,

            dataIndex: 'year',
            fixed: 'left',
            render: (text: number) => (
              <div>
                {text}
                {I18N.Factors.year}
              </div>
            ),
          },
          {
            title: I18N.carbonFootPrintLCA.totalEmissions,
            dataIndex: 'total',
            width: 120,
            fixed: 'left',
            render: text => {
              return text || '-';
            },
          },
          {
            title: I18N.eca.ghgStandard,
            dataIndex: 'CO₂e',
            children: [
              {
                title: I18N.eca.scopeOne,
                dataIndex: `scopeOne`,
                width: 120,
                render: (_, record: any, index: number) => {
                  return pageTypeInfo === PageTypeInfo.show ? (
                    record?.scopeOne || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      disabled={culDisAbled()}
                      value={record?.scopeOne}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'scopeOne');
                      }}
                    />
                  );
                },
              },
              {
                title: I18N.eca.scope2,
                dataIndex: `scopeTwo`,
                width: 120,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'scopeTwo');
                      }}
                    />
                  ),
              },
              {
                title: I18N.eca.fanWeisan,
                dataIndex: `scopeThree`,
                width: 120,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'scopeThree');
                      }}
                    />
                  ),
              },
            ],
          },
          {
            title: I18N.eca.isoStandard,
            dataIndex: 'CO₂e',
            children: [
              {
                title: I18N.eca.directDischargeOr,
                dataIndex: `direct`,
                width: 140,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'direct');
                      }}
                    />
                  ),
              },
              {
                title: I18N.eca.indirectEnergyEmissions,
                dataIndex: `energy`,
                width: 130,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'energy');
                      }}
                    />
                  ),
              },
              {
                title: I18N.eca.transportationIndirectDischarge,
                dataIndex: `transport`,
                width: 130,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'transport');
                      }}
                    />
                  ),
              },
              {
                title: I18N.eca.outsourcedProductsOr,
                dataIndex: `outsourcing`,
                width: 190,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'outsourcing');
                      }}
                    />
                  ),
              },
              {
                title: I18N.eca.downstreamOfSupplyChain,
                dataIndex: `supplyChain`,
                width: 140,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'supplyChain');
                      }}
                    />
                  ),
              },

              {
                title: I18N.eca.otherIndirectEmissions,
                dataIndex: `rests`,
                width: 120,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder={I18N.base.pleaseEnter}
                      value={text}
                      disabled={culDisAbled()}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'rests');
                      }}
                    />
                  ),
              },
            ],
          },
        ]}
        dataSource={filed.value}
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};
