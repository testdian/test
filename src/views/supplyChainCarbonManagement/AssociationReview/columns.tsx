import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { Toast } from '@/utils';
import { modelFooterBtnStyle } from '@/views/components/utils/index';

import { SUPPLIER_LINK_TYPE, SUPPLIER_TYPE } from './constant';
import { postSupplierListStatus } from './service';
import { SupplierLinkResp } from './type';

const { SUPPLIER, CUSTOMER } = SUPPLIER_TYPE;

const { PENDING_FEEDBACK, AGREED, REJECTED } = SUPPLIER_LINK_TYPE;

export const columns = ({
  refresh,
}: {
  refresh?: TableContext['refresh'];
}): TableRenderProps<SupplierLinkResp>['columns'] => [
  {
    title: I18N.supplyChainCarbonManagement.associatedMerchantName,
    dataIndex: 'linkCompanyName',
    fixed: 'left',
  },
  {
    title:
      I18N.supplyChainCarbonManagement.theSoleRepresentativeOfTheEnterprise,
    dataIndex: 'linkUniqueCode',
  },
  {
    title: I18N.supplyChainCarbonManagement.relatedApplication,
    dataIndex: 'supplierType',
    ellipsis: false,
    render: supplierType => {
      if (supplierType === CUSTOMER) {
        return I18N.supplyChainCarbonManagement
          .theOtherPartysApplicationIsSuccessful2;
      }
      if (supplierType === SUPPLIER) {
        return I18N.supplyChainCarbonManagement
          .theOtherPartysApplicationIsSuccessful;
      }
      return '-';
    },
  },
  {
    title: I18N.supplyChainCarbonManagement.relatedMerchantCategory,
    dataIndex: 'supplierType_name',
  },
  {
    title: I18N.Factors.state,
    dataIndex: 'supplierLinkStatus',
    render: (value, record) => {
      const status = {
        [PENDING_FEEDBACK]: COLOR.grey,
        [AGREED]: COLOR.green,
        [REJECTED]: COLOR.red,
      } as {
        [key: number]: keyof typeof COLOR;
      };
      return (
        <ColorTag
          color={status[Number(value)]}
          text={record?.supplierLinkStatus_name}
        />
      );
    },
  },
  {
    title: I18N.supplyChainCarbonManagement.applicationTime,
    dataIndex: 'createTime',
    ellipsis: false,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    width: 180,
    render: (_v, row) => {
      const { id, supplierLinkStatus } = row;
      /** 状态是否是待反馈 */
      const isPendingFeedback = supplierLinkStatus === PENDING_FEEDBACK;
      return (
        <TableActions
          menus={compact([
            isPendingFeedback &&
              checkAuth('/supplyChain/associationReview/status', {
                label: I18N.supplyChainCarbonManagement.agree,
                key: I18N.supplyChainCarbonManagement.agree,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {
                          I18N.supplyChainCarbonManagement
                            .confirmAndAgreeToClose
                        }
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: async () => {
                      if (!id) return;
                      await postSupplierListStatus({
                        id,
                        supplierLinkStatus: AGREED,
                      });
                      Toast(
                        'success',
                        I18N.supplyChainCarbonManagement.operationSuccessful,
                      );
                      refresh?.({ stay: true, tab: 1 });
                    },
                  });
                },
              }),
            isPendingFeedback &&
              checkAuth('/supplyChain/associationReview/status', {
                label: I18N.supplyChainCarbonManagement.refuse,
                key: I18N.supplyChainCarbonManagement.refuse,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {I18N.supplyChainCarbonManagement.confirmRejectClose}
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: async () => {
                      if (!id) return;
                      await postSupplierListStatus({
                        id,
                        supplierLinkStatus: REJECTED,
                      });
                      Toast(
                        'success',
                        I18N.supplyChainCarbonManagement.operationSuccessful,
                      );
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
