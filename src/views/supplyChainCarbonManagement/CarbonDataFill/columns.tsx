import I18N from '@src/lang/I18N';
import { compact, includes } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { modal } from '@/store/module/notification';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/components/utils/index';

import { APPLY_STATUS, APPLY_TYPE_TEXT } from './constant';
import {
  postSupplierRollback,
  postSupplierSubmit,
  postSupplierSubmitApplus,
} from './service';
import { SupplierFillResp } from './type';
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
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps<SupplierFillResp>['columns'] => [
  {
    title: I18N.supplyChainCarbonManagement.customerName,
    dataIndex: 'companyName',
    fixed: 'left',
  },
  {
    title: I18N.supplyChainCarbonManagement.contacts,
    dataIndex: 'applyRealName',
  },
  {
    title: I18N.supplyChainCarbonManagement.contactInformation,
    dataIndex: 'applyMobile',
  },
  {
    title: I18N.supplyChainCarbonManagement.atTheTimeOfTaskInitiation,
    dataIndex: 'applyTime',
    ellipsis: false,
  },
  {
    title: I18N.supplyChainCarbonManagement.taskDeadline,
    dataIndex: 'deadline',
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
    title: I18N.supplyChainCarbonManagement.approvalFilling,
    dataIndex: 'approvalReport',
    fixed: 'right',
    width: 180,
    render: (_, row) => {
      const { applyStatus, id, fillProductName = ' ', applyType } = row;
      return applyStatus === CLOSED ? (
        '-'
      ) : (
        <TableActions
          menus={compact([
            // 未填报/填报中/审批不通过/已撤回/已填报 => 填报按钮
            includes(
              [NOT_FILLED_IN, FILLING_IN, REVIEW_FAILED, WITHDRAWN, REPORTED],
              applyStatus,
            ) &&
              checkAuth('/supplyChain/carbonDataFill/fill', {
                label: I18N.eca.fillInTheReport,
                key: I18N.eca.fillInTheReport,
                onClick: async () => {
                  const pageInfoType = PageTypeInfo.edit;
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmFillInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [pageInfoType, id],
                    ),
                  );
                },
              }),
            // 审批不通过/已撤回/已填报 => 提交按钮
            includes([REVIEW_FAILED, WITHDRAWN, REPORTED], applyStatus) &&
              checkAuth('/supplyChain/carbonDataFill/submit', {
                label: I18N.dashborad.submit,
                key: I18N.dashborad.submit,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {I18N.eca.confirmSubmissionOfThis}
                        <span className={modalText}>（{fillProductName}）</span>
                        {I18N.supplyChainCarbonManagement.of}
                        {applyType ? APPLY_TYPE_TEXT[applyType] : ''}
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplierSubmit({
                        id,
                      }).then(() => {
                        Toast('success', I18N.eca.submittedSuccessfully);
                        refresh?.({ stay: true, tab: 1 });
                      });
                    },
                  });
                },
              }),
            // 待审批 => 撤回按钮
            includes([TO_BE_REVIEWED], applyStatus) &&
              checkAuth('/supplyChain/carbonDataFill/withdraw', {
                label: I18N.eca.withdraw,
                key: I18N.eca.withdraw,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <span>
                        {
                          I18N.supplyChainCarbonManagement
                            .confirmWithdrawalOfThe
                        }
                        <span className={modalText}>（{fillProductName}）</span>
                        {I18N.supplyChainCarbonManagement.of}
                        {applyType ? APPLY_TYPE_TEXT[applyType] : ''}
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplierRollback({
                        id,
                      }).then(() => {
                        Toast('success', I18N.eca.recallSuccessful);
                        refresh?.({ stay: true, tab: 1 });
                      });
                    },
                  });
                },
              }),
            checkAuth('/supplyChain/carbonDataFill/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmFillInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
  {
    title: I18N.supplyChainCarbonManagement.applu,
    dataIndex: 'applusThirdPartyCertification',
    fixed: 'right',
    render: (_, row) => {
      const { id, applusAuditStatus, applyStatus } = row;
      return applyStatus === CLOSED ? (
        '-'
      ) : (
        <TableActions
          menus={compact([
            checkAuth('/supplyChain/carbonDataFill/submitApplus', {
              label: I18N.supplyChainCarbonManagement.oneClickReview,
              key: I18N.supplyChainCarbonManagement.oneClickReview,
              disabled: applusAuditStatus === REVIEWED,
              onClick: async () => {
                modal.confirm({
                  title: I18N.Factors.prompt,
                  icon: '',
                  content: (
                    <span>
                      {
                        I18N.supplyChainCarbonManagement
                          .willBeAutomaticallyGenerated
                      }
                    </span>
                  ),
                  ...modelFooterBtnStyle,
                  okText: I18N.base.confirm,
                  cancelText: I18N.Factors.cancel,
                  onOk: () => {
                    if (!id) return {};
                    return postSupplierSubmitApplus({
                      id,
                    }).then(({ data }) => {
                      const { assessmentId = 0 } = data?.data || {};
                      const base = virtualLinkTransform(
                        CertifiCatioinReviewCenterMaps.certificationReviewCenterFootprintLInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.add, 0],
                      );
                      navigate(`${base}?assessmentId=${assessmentId}`);
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
