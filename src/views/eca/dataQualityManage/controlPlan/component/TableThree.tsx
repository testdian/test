/*
 * @@description:数据质量控制计划/主营产品或服务
 */
import I18N from '@src/lang/I18N';
import { Table } from 'antd';
import { ColumnGroupType } from 'antd/es/table';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { Page } from '@/components/Page';
import { TableActions } from '@/components/Table/TableActions';
import {
  ControlPlanProduct,
  getComputationControlPlanProductListControlPlanId,
  postComputationControlPlanProductDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import {
  Toast,
  changeTableColumnsNoText,
  returnDelModalStyle,
  returnNoIconModalStyle,
} from '@/utils';

import { ProductDrawer } from '../../utils/model';

type TypeControlPlanProduct = Omit<ControlPlanProduct, 'serviceUnit'> & {
  serviceUnit?: string[];
};
export const TableThree = () => {
  //  当前状态  ADD SHOW COPY
  const [status, setStatus] = useState<
    'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL'
  >('ADD');
  // 控制计划弹窗显隐
  const [visible, changeVisAble] = useState(false);
  /** 用于缓存record**/
  const [cathRecord, getCathRecord] = useState<TypeControlPlanProduct>({});
  const [dataSource, getDataSource] = useState<ControlPlanProduct[]>([]);
  const controlPlanId = new URLSearchParams(location.search).get('id') || '';

  // 获取主营产品-列表
  const productListFn = async () => {
    await getComputationControlPlanProductListControlPlanId({
      controlPlanId: Number(controlPlanId),
    }).then(({ data }) => {
      if (data.code === 200) {
        getDataSource([...(data.data || [])]);
      }
      // console.log(data);
    });
  };
  useEffect(() => {
    productListFn();
  }, []);
  return (
    <>
      <Page
        title=''
        onBtnClick={async () => {
          setStatus('ADD');
          changeVisAble(true);
          getCathRecord({});
        }}
        actionBtnChild={
          window.location.pathname.indexOf('edit') >= 0 && (
            <div>{I18N.Factors.newAddition}</div>
          )
        }
      >
        <Table<ControlPlanProduct>
          columns={
            changeTableColumnsNoText(
              [
                {
                  title: I18N.carbonFootPrintLCA.number,
                  dataIndex: 'name',
                  render: (_, __, index) => {
                    return index + 1;
                  },
                },
                {
                  title: I18N.eca.productsOrServices3,
                  dataIndex: 'serviceName',
                },
                {
                  title: I18N.eca.productsOrServices2,
                  dataIndex: 'serviceUnitName',
                },
                {
                  title: I18N.eca.productsOrServices,
                  dataIndex: 'serviceDesc',
                },
                {
                  title: I18N.Factors.operation,
                  render: (_, record) => {
                    const recordInfo = record as ControlPlanProduct;
                    return (
                      <TableActions
                        menus={compact([
                          window.location.pathname.indexOf('show') === -1 && {
                            label: I18N.Factors.edit,
                            key: I18N.Factors.edit,
                            onClick: async ev => {
                              setStatus('EDIT');
                              ev.stopPropagation();
                              changeVisAble(true);
                              getCathRecord({
                                ...recordInfo,
                                serviceUnit:
                                  recordInfo?.serviceUnit?.split(','),
                              });
                            },
                          },
                          window.location.pathname.indexOf('show') === -1 && {
                            label: I18N.Factors.delete,
                            key: I18N.Factors.delete,
                            onClick: async ev => {
                              ev?.stopPropagation();
                              modal.confirm({
                                title: I18N.Factors.prompt,
                                ...returnNoIconModalStyle,
                                ...returnDelModalStyle,
                                content: (
                                  <span>
                                    {I18N.eca.confirmDeletionOfThis5}
                                    <span className='modal_text'>
                                      {recordInfo?.serviceName}?
                                    </span>
                                  </span>
                                ),
                                onOk: () => {
                                  return postComputationControlPlanProductDelete(
                                    {
                                      req: { id: Number(recordInfo?.id) },
                                    },
                                  ).then(({ data }) => {
                                    if (data.code === 200) {
                                      Toast(
                                        'success',
                                        I18N.Factors.deleteSuccessful,
                                      );
                                      productListFn?.();
                                    }
                                  });
                                },
                                okText: I18N.base.confirm,
                                cancelText: I18N.Factors.cancel,
                              });
                            },
                          },
                          {
                            label: I18N.Factors.check,
                            key: I18N.Factors.check,
                            onClick: async ev => {
                              setStatus('SHOW');
                              ev.stopPropagation();
                              changeVisAble(true);
                              getCathRecord({
                                ...recordInfo,
                                serviceUnit:
                                  recordInfo?.serviceUnit?.split(','),
                              });
                            },
                          },
                        ])}
                      />
                    );
                  },
                },
              ],
              '-',
            ) as ColumnGroupType<ControlPlanProduct>[]
          }
          dataSource={[...dataSource]}
          rowKey='id'
          pagination={{
            showSizeChanger: true,
            size: 'small',
          }}
          scroll={{ x: 1200 }}
          size='small'
        />
      </Page>
      {/* 主营产品弹窗 */}
      <ProductDrawer
        status={status}
        visible={visible}
        onCancelFn={() => {
          changeVisAble(false);
        }}
        onOkFn={() => {
          changeVisAble(false);
          productListFn?.();
        }}
        initValue={cathRecord}
      />
    </>
  );
};
