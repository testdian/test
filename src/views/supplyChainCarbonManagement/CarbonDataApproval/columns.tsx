import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';

import { SupplierApprovalResp } from './type';
import { APPLY_STATUS } from '../CarbonDataFill/constant';
import { ApproverPopover } from '../components/ApproverModal';
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
  navigate,
}: {
  navigate: NavigateFunction;
}): TableRenderProps<SupplierApprovalResp>['columns'] => [
  {
    title: I18N.supplyChainCarbonManagement.purchaseProductName,
    dataIndex: 'productName',
    fixed: 'left',
    width: 160,
  },
  {
    title: I18N.carbonFootPrint.supplierName,
    dataIndex: 'supplierName',
    fixed: 'left',
    width: 150,
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
  },
  {
    title: I18N.certificationReviewCenter.evaluationMethods,
    dataIndex: 'assessmentMethodName',
  },
  {
    title: I18N.certificationReviewCenter.evaluatingIndicator,
    dataIndex: 'assessmentTargetNames',
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
    width: 120,
  },
  {
    title: I18N.supplyChainCarbonManagement.pendingApprover,
    dataIndex: 'targetNames',
    width: 150,
    render: (value, record) => {
      const isApproval = record.applyStatus === TO_BE_REVIEWED;
      return isApproval ? (
        <ApproverPopover id={record.id}>{value}</ApproverPopover>
      ) : (
        '-'
      );
    },
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'applyStatus',
    width: 140,
    render: (value, row) => {
      const { id, dataId, applyStatus, userBtnFlag } = row;
      return applyStatus === CLOSED ? (
        '-'
      ) : (
        <TableActions
          menus={compact([
            value === TO_BE_REVIEWED &&
              userBtnFlag &&
              checkAuth('/supplyChain/carbonDataApproval/approve', {
                label: I18N.router.approval,
                key: I18N.router.approval,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmApprovalInfo,
                      [
                        PAGE_TYPE_VAR,
                        ':id',
                        ':dataId',
                        ':dataType',
                        ':auditStatus',
                      ],
                      [PageTypeInfo.edit, id, dataId, 'approve', applyStatus],
                    ),
                  );
                },
              }),
            checkAuth('/supplyChain/carbonDataApproval/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmApprovalInfo,
                    [
                      PAGE_TYPE_VAR,
                      ':id',
                      ':dataId',
                      ':dataType',
                      ':auditStatus',
                    ],
                    [PageTypeInfo.show, id, dataId, 'show', applyStatus],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
