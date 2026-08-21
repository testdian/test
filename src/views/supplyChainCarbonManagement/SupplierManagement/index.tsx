/**
 * @description 供应链商户管理
 */
import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { every } from 'lodash-es';
import { Key, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { modal } from '@/store/module/notification';
import { Toast, modelFooterBtnStyle } from '@/utils';
// import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { SUPPLIER_STATUS } from './constant';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getSupplierList, postSupplierListSubmit } from './service';
import { SupplierListRequest, SupplierResp } from './type';
import { useSupplyChainEnums } from '../hooks/useEnums';

const { UN_SUBMITTED, REVIEW_FAILED } = SUPPLIER_STATUS;

function SupplierManagement() {
  const navigate = useNavigate();
  const { refresh, tableRef } = useTable();

  /** 所属组织枚举 */
  // const orgList = useOrgs();

  /** 状态 */
  const supplyStatusOptions = useSupplyChainEnums('SupplierStatus');

  /** 商户类型 */
  const supplyTypeOptions = useSupplyChainEnums('SupplierType');

  /** 选中的ID */
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  /** 选中的行 */
  const [selectedRowArr, setSelectedRowArr] = useState<SupplierResp[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (currentSelectedRowKeys: Key[], selectedRows: SupplierResp[]) => {
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRowArr(selectedRows);
    },
  };

  const searchApi: CustomSearchProps<
    SupplierResp,
    SupplierListRequest
  > = args =>
    getSupplierList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      wrapperClass={style.supplyManagementWrapper}
      title={I18N.supplyChainCarbonManagement.supplyChainMerchants}
      rightRender={[
        checkAuth(
          '/supplyChain/supplierManagement/batchSubmit',
          <Button
            type='default'
            onClick={() => {
              if (selectedRowKeys.length === 0) {
                Toast('warning', I18N.eca.pleaseSelectData2);
                return;
              }
              if (
                !every(
                  selectedRowArr,
                  item =>
                    item.supplierStatus === UN_SUBMITTED ||
                    item.supplierStatus === REVIEW_FAILED,
                )
              ) {
                Toast(
                  'error',
                  I18N.supplyChainCarbonManagement
                    .underReviewOrAlreadyCompleted,
                );
                return;
              }
              modal.confirm({
                title: I18N.Factors.prompt,
                icon: '',
                content: I18N.supplyChainCarbonManagement.batchSubmissionWill,
                ...modelFooterBtnStyle,
                okText: I18N.base.confirm,
                cancelText: I18N.Factors.cancel,
                onOk: async () => {
                  await postSupplierListSubmit({
                    idList: selectedRowKeys as number[],
                  });
                  Toast('success', I18N.eca.submittedSuccessfully);
                  refresh?.();
                  setSelectedRowKeys([]);
                },
              });
            }}
          >
            {I18N.supplyChainCarbonManagement.batchSubmissionForReview}
          </Button>,
        ),
        checkAuth(
          '/supplyChain/supplierManagement/add',
          <Button
            type='primary'
            onClick={() => {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmManagementInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [PageTypeInfo.add, 'null'],
                ),
              );
            }}
          >
            <PlusOutlined /> {I18N.Factors.newAddition}
          </Button>,
        ),
        checkAuth(
          '/supplyChain/supplierManagement/import',
          <Button
            type='default'
            onClick={() => {
              navigate(SccmRouteMaps.sccmManagementImport);
            }}
          >
            {I18N.carbonFootPrint.import}
          </Button>,
        ),
      ]}
    >
      <CustomTableRender<SupplierResp, SupplierListRequest>
        tableRef={tableRef}
        searchProps={{
          searchOnMount: false,
          schema: searchSchema(supplyStatusOptions, supplyTypeOptions),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate, refresh }),
          scroll: { x: 1400 },
          rowSelection: {
            type: 'checkbox',
            ...rowSelection,
          },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
    </Page>
  );
}
export default SupplierManagement;
