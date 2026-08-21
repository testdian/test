/**
 * @description 供应商数据填报-详情
 */
import I18N from '@src/lang/I18N';
import { Table, Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  getSupplychainAuditSupplierLogList,
  AuditLog,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { changeTableColumnsNoText } from '@/utils';

import CarbonFootPrintFill from './CarbonFootPrintFill';
import { columns } from './columns';
import { FILL_TABS, FILL_TABS_ITEMS } from './constant';
import style from '../../SupplierManagement/Info/index.module.less';
import CarbonDataRequire from '../../components/CarbonDataRequire';
import { TypeApplyInfoResp } from '../../utils/type';
import { getSupplierFillApplyData } from '../service';

const { DATA_REQUEST, DATA_FILL } = FILL_TABS;

function CarbonDataFillInfo() {
  const navigate = useNavigate();

  const { id, pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 当前切换的顶部Tab栏 */
  const [currentTab, setCurrentTab] = useState<string>(DATA_REQUEST);

  /** 碳数据填报数据请求的详情 */
  const [cathRecord, setCathRecord] = useState<TypeApplyInfoResp>();

  /** 获取数据请求类型 1: 核算结果 2: 核算过程 */
  const [applyType, setApplyType] = useState<number>();

  /** 客户的反馈记录 */
  const [feedBackRecord, setFeedBackRecord] = useState<AuditLog[]>();

  /** 获取数据请求的详情 */
  useEffect(() => {
    if (id) {
      getSupplierFillApplyData({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;
          const { productUnit } = result || {};
          /** 核算单位相关处理 */
          const productUnitArr = productUnit ? productUnit?.split(',') : [];
          setCathRecord({
            ...result,
            productUnit: productUnitArr,
          });
          setApplyType(Number(data?.data?.applyType));
          /** 只有客户审核后才会有审核记录 3: 审核通过，4: 审核不通过 */
          if ([3, 4].includes(Number(data?.data?.applyStatus))) {
            /** 获取客户反馈的记录 */
            getSupplychainAuditSupplierLogList({
              applyInfoId: Number(id),
            }).then(({ data: rData }) => {
              if (rData?.code === 200) {
                setFeedBackRecord(rData.data);
              }
            });
          }
        }
      });
    }
  }, [id]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Tabs
        defaultActiveKey={DATA_REQUEST}
        items={FILL_TABS_ITEMS}
        onChange={value => {
          setCurrentTab(value);
        }}
      />

      {/* 数据请求 */}
      {currentTab === DATA_REQUEST && (
        <div>
          <CarbonDataRequire currentModalType='fill' cathRecord={cathRecord} />
          {/* 客户反馈 */}
          {feedBackRecord && feedBackRecord.length > 0 && (
            <div>
              <h4>{I18N.supplyChainCarbonManagement.customerFeedback}</h4>
              <Table
                columns={changeTableColumnsNoText(columns(), '-')}
                dataSource={feedBackRecord}
                pagination={false}
              />
            </div>
          )}
        </div>
      )}

      {/* 数据填报 */}
      {currentTab === DATA_FILL && (
        <div>
          <CarbonFootPrintFill
            id={id}
            cathRecord={cathRecord}
            applyType={applyType}
            isDetail={isDetail}
          />
        </div>
      )}

      {currentTab === DATA_REQUEST && (
        <FormActions
          place='center'
          buttons={compact([
            {
              title: I18N.Factors.return,
              onClick: async () => {
                navigate(SccmRouteMaps.sccmFill);
              },
            },
          ])}
        />
      )}
    </div>
  );
}
export default CarbonDataFillInfo;
