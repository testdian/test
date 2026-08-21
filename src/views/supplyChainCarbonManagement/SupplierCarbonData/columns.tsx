/*
 * @@description:
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle, Toast } from '@/utils';

import { postCloseSupplyApply } from './service';
import { SupplierDataResp } from './type';
import { APPLY_STATUS } from '../CarbonDataFill/constant';
import { APPROVAL_STATUS } from '../utils/constant';

const {
  NOT_FILLED_IN,
  FILLING_IN,
  TO_BE_REVIEWED,
  APPROVED,
  REVIEW_FAILED,
  WITHDRAWN,
  REPORTED,
  CLOSED,
} = APPLY_STATUS;

const { UNAUDITED, UNDER_REVIEW, REVIEWED } = APPROVAL_STATUS;

export const columns = ({
  refresh,
  navigate,
}: {
  refresh: TableContext['refresh'];
  navigate: NavigateFunction;
}): TableRenderProps<SupplierDataResp>['columns'] => [
  {
    title: I18N.supplyChainCarbonManagement.purchaseProductName,
    dataIndex: 'productName',
    fixed: 'left',
  },
  {
    title: I18N.carbonFootPrint.supplierName,
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  // {
  //   title: I18N.carbonData.affiliatedOrganization,
  //   dataIndex: 'orgName',
  // },
  {
    title: I18N.supplyChainCarbonManagement.dataRequestClass,
    dataIndex: 'applyType_name',
  },
  {
    title: I18N.supplyChainCarbonManagement.supplierData,
    dataIndex: 'dataCode',
    width: 180,
  },
  {
    title: I18N.certificationReviewCenter.evaluationMethods,
    dataIndex: 'assessmentMethodName',
  },
  {
    title: I18N.certificationReviewCenter.evaluatingIndicator,
    dataIndex: 'assessmentTargetNames',
    width: 200,
  },
  {
    title: I18N.supplyChainCarbonManagement.fillInTheApprovalForm,
    dataIndex: 'applyStatus',
    render: (value, record) => {
      const status = {
        [NOT_FILLED_IN]: COLOR.grey,
        [FILLING_IN]: COLOR.blue,
        [TO_BE_REVIEWED]: COLOR.orange,
        [APPROVED]: COLOR.green,
        [REVIEW_FAILED]: COLOR.red,
        [WITHDRAWN]: COLOR.yellow,
        [REPORTED]: COLOR.lightBlue,
        [CLOSED]: COLOR.pink,
      } as {
        [key: number]: keyof typeof COLOR;
      };
      return (
        <ColorTag
          color={status[Number(value)]}
          text={record?.applyStatus_name}
        />
      );
    },
  },
  {
    title: I18N.supplyChainCarbonManagement.dataReview,
    dataIndex: 'applusAuditStatus',
    render: (value, record) => {
      const status = {
        [UNAUDITED]: COLOR.grey,
        [UNDER_REVIEW]: COLOR.orange,
        [REVIEWED]: COLOR.green,
      } as {
        [key: number]: keyof typeof COLOR;
      };
      return (
        <ColorTag
          color={status[Number(value)]}
          text={record?.applusAuditStatus_name}
        />
      );
    },
  },
  {
    title: I18N.eca.submissionTime,
    dataIndex: 'submitTime',
    ellipsis: false,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'action',
    fixed: 'right',
    width: 148,
    render: (_, row) => {
      const { id, applyStatus } = row;
      return applyStatus === CLOSED ? (
        '-'
      ) : (
        <TableActions
          menus={compact([
            checkAuth('/supplyChain/supplierCarbonData/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmCarbonDataInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
            applyStatus !== APPROVED &&
              checkAuth('/supplyChain/supplierCarbonData/closeTask', {
                label: I18N.supplyChainCarbonManagement.closeTask,
                key: I18N.supplyChainCarbonManagement.closeTask,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {I18N.supplyChainCarbonManagement.confirmToCloseWhen}
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: () => {
                      if (!id) return {};
                      return postCloseSupplyApply({
                        id,
                      }).then(() => {
                        Toast(
                          'success',
                          I18N.supplyChainCarbonManagement.closedSuccessfully,
                        );
                        refresh?.({ stay: true, tab: 1 });
                      });
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
