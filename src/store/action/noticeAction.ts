import I18N from '@src/lang/I18N';

import { CBAMRouteMaps } from '@/router/utils/cbam';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  Msg,
  getSystemMsgUnreadNum,
  postSystemMsgAllRead,
  postSystemMsgClick,
} from '@/sdks_v2/new/systemV2ApiDocs';
import { Toast } from '@/utils';

import store from '..';
import { noticeActions } from '../module/notice';
/**
 * 未读消息数量回调
 * */
export const getUnreadNumFn = async () => {
  const { data } = await getSystemMsgUnreadNum({});
  store.dispatch(noticeActions.updateCount(data?.data));
};
export const readAllFn = async (
  refresh?: (arg0: { stay: boolean; tab: number }) => void,
) => {
  await postSystemMsgAllRead({});
  getUnreadNumFn();
  // 更新消息中心列表
  refresh?.({ stay: false, tab: 0 });
};
/**
 * 判断用户是否有审批权限
 */
const checkMsgFn = async (
  item: Msg,
  changeIsOpen?: ((arg0: boolean) => void) | undefined,
) => {
  // 消息点击跳转到对应模块的列表页面
  /**
   * msgBizType
   * 401 企业碳核算-排放数据审核 /carbonAccounting/approvalManage
   * 402 企业碳核算-排放数据审核通过 /carbonAccounting/fillData
   * 403 企业碳核算-排放数据审核不通过 /carbonAccounting/fillData
   * 404:  carbonAccounting/fillData/edit/49/103
   * 405: 企业碳核算-对应碳排放核算-排放源管理页面 /carbonAccounting/carbonMissionAccounting/emissionSource/add/95
   * 801:您的供应商向您授权提供了新的产品环境足迹数据，点击前往查看; /supplyChain/carbonDataApproval
   * 802:您提交的供应链商户审核已通过，点击查看;  /supplyChain/supplierManagement
   * 803:您有待审核的供应链关联申请，点击查看; /supplyChain/associationReview
   * 804:您有待填报的供应链核算数据，点击查看; /supplyChain/carbonDataFill/fill
   * 805:您有待审批的供应链核算数据，点击审批; /supplyChain/carbonDataApproval/approve
   * 806:您提交的供应链核算数据审批完成，点击查看; /supplyChain/carbonDataFill/detail
   * 807:您提交的供应链核算数据审批不通过，点击查看 /supplyChain/carbonDataFill/fill
   * 882:您提交的供应链商户审核不通过，点击查看 /supplyChain/supplierManagement
   */
  // 区分认证审核  企业碳核算 和产品碳足迹
  const returnCenterUrl = (item: Msg) => {
    if (Number(item?.relation?.type) === 3) {
      return virtualLinkTransform(
        CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.show, item?.relation?.id],
      );
    }
    return Number(item?.relation?.type) === 2
      ? virtualLinkTransform(
          CertifiCatioinReviewCenterMaps.certificationReviewCenterFootprintLInfo,
          [PAGE_TYPE_VAR, ':id'],
          [PageTypeInfo.show, item?.relation?.id],
        )
      : virtualLinkTransform(
          CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfo,
          [PAGE_TYPE_VAR, ':id'],
          [PageTypeInfo.show, item?.relation?.id],
        );
  };
  const returnRelationStr = {
    801: SccmRouteMaps.sccmCarbonData,
    802: SccmRouteMaps.sccmManagement,
    803: SccmRouteMaps.sccmQuestionnaire,
    804: virtualLinkTransform(
      SccmRouteMaps.sccmFillInfo,
      [PAGE_TYPE_VAR, ':id'],
      [PageTypeInfo.edit, item?.relation?.id],
    ),
    805: virtualLinkTransform(
      SccmRouteMaps.sccmApprovalInfo,
      [PAGE_TYPE_VAR, ':id', ':dataId', ':dataType', ':auditStatus'],
      [
        PageTypeInfo.edit,
        item?.relation?.id,
        item?.relation?.dataId,
        'approve',
        0,
      ],
    ),
    806: virtualLinkTransform(
      SccmRouteMaps.sccmFillInfo,
      [PAGE_TYPE_VAR, ':id'],
      [PageTypeInfo.show, item?.relation?.id],
    ),
    807: virtualLinkTransform(
      SccmRouteMaps.sccmFillInfo,
      [PAGE_TYPE_VAR, ':id'],
      [PageTypeInfo.edit, item?.relation?.id],
    ),
    882: SccmRouteMaps.sccmManagement,
    401: virtualLinkTransform(
      EcaRouteMaps.approvalManageInfo,
      [PAGE_TYPE_VAR, ':id', ':dataId', ':auditStatus'],
      [PageTypeInfo.edit, item?.relation?.id, item?.relation?.dataId, 0],
    ),
    402: virtualLinkTransform(
      EcaRouteMaps.approvalManageInfo,
      [PAGE_TYPE_VAR, ':id', ':dataId', ':auditStatus'],
      [PageTypeInfo.show, item?.relation?.id, item?.relation?.dataId, 3],
    ),

    403: virtualLinkTransform(
      EcaRouteMaps.approvalManageInfo,
      [PAGE_TYPE_VAR, ':id', ':dataId', ':auditStatus'],
      [PageTypeInfo.show, item?.relation?.id, item?.relation?.dataId, 3],
    ),
    404: virtualLinkTransform(
      EcaRouteMaps.fillDataInfo,
      [PAGE_TYPE_VAR, ':id', ':approvalId'],
      [PageTypeInfo.edit, item?.relation?.id, item?.relation?.dataId],
    ),
    405: virtualLinkTransform(
      EcaRouteMaps.carbonMissionAccountingSourceInfo,
      [PAGE_TYPE_VAR, ':id'],
      [PageTypeInfo.add, item?.relation?.dataId],
    ),
    601: returnCenterUrl(item),
    602: returnCenterUrl(item),
    // cbam部分
    // 您提交的CBAM前体数据审批完成，点击查看 /cbam/precursorFill
    808: `${CBAMRouteMaps.cbamPrecursorDataFillInfo.replace(
      ':pageTypeInfo',
      `${PageTypeInfo.show}`,
    )}?id=${item?.relation?.id}`,
    // 您提交的CBAM前体数据审批不通过，点击查看 /cbam/precursorFill
    809: `${CBAMRouteMaps.cbamPrecursorDataFillInfo.replace(
      ':pageTypeInfo',
      `${PageTypeInfo.edit}`,
    )}?id=${item?.relation?.id}`,
    // 您有待审批的CBAM前体数据，点击审批 /cbam/precursorApproval
    810: `${CBAMRouteMaps.cbamPrecursorDataApprovalInfo.replace(
      ':pageTypeInfo',
      `${PageTypeInfo.edit}`,
    )}?id=${item?.relation?.id}`,
    // 您有待填报的CBAM前体数据，点击查看 /cbam/precursorFill
    811: `${CBAMRouteMaps.cbamPrecursorDataFillInfo.replace(
      ':pageTypeInfo',
      `${PageTypeInfo.edit}`,
    )}?id=${item?.relation?.id}`,
  };
  window.location.href = returnRelationStr?.[item?.msgBizType || '403'];
  changeIsOpen?.(false);
};
/**
 * 消息点击的回调
 * item：单条消息数据
 * changeIsOpen：是否展开
 * fn：回调函数
 * */

export const msgClickFn = async (
  item: Msg,
  changeIsOpen: ((arg0: boolean) => void) | undefined,
  fn: () => void,
) => {
  await postSystemMsgClick({
    req: { id: item.id || 0 },
  });
  // 判断页面

  fn?.();
  // 如果没有页面权限 toast提示
  if (!item.pagePermFlag) {
    // 消息提示
    Toast('error', I18N.utils.notHavePermission);
  } else {
    // 判断用户是否有审批权限
    checkMsgFn(item, changeIsOpen);
  }
};
