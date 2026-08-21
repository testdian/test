/*
 * @@description:
 */
import I18N from '@src/lang/I18N';
import { compact, includes } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { modal } from '@/store/module/notification';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/components/utils/index';

import { SUPPLIER_STATUS } from './constant';
import {
  getSupplierInfo,
  postSupplierListStatus,
  postSupplierListSubmit,
} from './service';
import { SupplierResp } from './type';

const { ENABLE, DISABLED, UNDER_REVIEW, UN_SUBMITTED, REVIEW_FAILED } =
  SUPPLIER_STATUS;

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps<SupplierResp>['columns'] => [
  {
    title: I18N.supplyChainCarbonManagement.merchantName,
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: I18N.supplyChainCarbonManagement.merchantType,
    dataIndex: 'supplierType_name',
  },
  // {
  //   title: I18N.carbonData.affiliatedOrganization,
  //   dataIndex: 'orgName',
  // },
  {
    title: I18N.supplyChainCarbonManagement.merchantCode,
    dataIndex: 'supplierCode',
  },

  {
    title: I18N.Factors.state,
    dataIndex: 'supplierStatus',
    render: (value, record) => {
      const status = {
        [UN_SUBMITTED]: COLOR.blue,
        [ENABLE]: COLOR.green,
        [DISABLED]: COLOR.grey,
        [UNDER_REVIEW]: COLOR.orange,
        [REVIEW_FAILED]: COLOR.red,
      } as {
        [key: number]: keyof typeof COLOR;
      };
      return (
        <ColorTag
          color={status[Number(value)]}
          text={record?.supplierStatus_name}
        />
      );
    },
  },
  {
    title: I18N.Factors.updateTime,
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'supplierStatus',
    width: 240,
    fixed: 'right',
    render: (value, row) => {
      const { id, supplierName } = row;
      /** 启用/禁用 按钮 */
      const text =
        Number(value) === ENABLE ? I18N.Factors.disabled : I18N.Factors.enable;
      /** 启用/禁用 展示文案 */
      const textBase =
        Number(value) === ENABLE ? I18N.base.disabled : I18N.base.enable;
      return (
        <TableActions
          menus={compact([
            checkAuth('/supplyChain/supplierManagement/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmManagementInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
            // 审核中不能编辑
            Number(value) !== UNDER_REVIEW &&
              checkAuth('/supplyChain/supplierManagement/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmManagementInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.edit, id],
                    ),
                  );
                },
              }),
            // 启用/禁用 => 禁用/启用按钮
            includes([ENABLE, DISABLED], Number(value)) &&
              checkAuth('/supplyChain/supplierManagement/status', {
                label: text,
                key: text,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {I18N.base.confirm}
                        {textBase}
                        {I18N.supplyChainCarbonManagement.theMerchant2}
                        <span className={modalText}>{supplierName}?</span>
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplierListStatus({
                        id,
                        supplierStatus:
                          Number(value) === ENABLE ? DISABLED : ENABLE,
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast(
                            'success',
                            I18N.template(
                              I18N.supplyChainCarbonManagement.textCompleted,
                              { val1: text },
                            ),
                          );
                          refresh?.({ stay: true, tab: 1 });
                        }
                      });
                    },
                  });
                },
              }),
            // 审核不通过/未提交 => 提交审核按钮
            includes([UN_SUBMITTED, REVIEW_FAILED], value) &&
              checkAuth('/supplyChain/supplierManagement/submitApproval', {
                label: I18N.supplyChainCarbonManagement.submitForReview,
                key: I18N.supplyChainCarbonManagement.submitForReview,
                onClick: async () => {
                  if (!id) return;
                  const { data } = await getSupplierInfo({ id });
                  const companyCode = data?.data?.companyCode;
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {companyCode ? (
                          <span>
                            {I18N.supplyChainCarbonManagement.theMerchant}
                            <span className={modalText}>
                              {I18N.supplyChainCarbonManagement.accountOpened}
                            </span>
                            {I18N.supplyChainCarbonManagement.isItTheSender}
                          </span>
                        ) : (
                          <span>
                            {I18N.supplyChainCarbonManagement.theMerchant}
                            <span className='warnRed'>
                              {
                                I18N.supplyChainCarbonManagement
                                  .notYetOpenedAnAccount
                              }
                            </span>
                            {
                              I18N.supplyChainCarbonManagement
                                .whetherToSubmitForOpening
                            }
                          </span>
                        )}
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: async () => {
                      await postSupplierListSubmit({
                        idList: [id],
                      });
                      Toast('success', I18N.eca.submittedSuccessfully);
                      refresh?.({ stay: true, tab: 1 });
                    },
                  });
                },
              }),
          ])}
        />
      );
    },
  },
];
