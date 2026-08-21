/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 15:29:05
 */

import I18N from '@src/lang/I18N';
import { Radio } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { geAuthDataDel, getSubmitAuthData } from '@/api/authData';
import { CustomTag, authAuditStatusDataColor } from '@/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { AuthAuditStatusOptionsArr, AuthTypeOptionsArr } from '@/hooks';
import { checkAuth } from '@/layout/utills';
import { CertifiCatioinReviewCenterMaps } from '@/router/utils/certificationReviewCenterEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Report } from '@/sdks/Newcomputation/computationV2ApiDocs';
import { modal } from '@/store/module/notification';
import { modelFooterBtnStyle } from '@/utils';
import { UseOrgs } from '@/views/eca/hooks';

export const columns = ({
  navigate,
  reportFn,
  refresh,
  locale,
}: {
  navigate: NavigateFunction;
  refresh?: TableContext['refresh'];
  reportFn: (record: Report) => void;
  locale: 'en-US' | 'zh-CN';
}): TableRenderProps<Report>['columns'] => [
  {
    title: I18N.certificationReviewCenter.auditDocumentNumber,
    dataIndex: 'authNo',
    width: 160,
    fixed: 'left',

    // copyable: true,
  },
  {
    title: I18N.certificationReviewCenter.auditDocumentName,
    dataIndex: 'authName',
    width: 160,
  },
  {
    title: I18N.certificationReviewCenter.auditDocumentClass,
    dataIndex: 'authType_name',
    width: 160,
  },

  {
    title: I18N.carbonData.affiliatedOrganization,
    dataIndex: 'orgName',
    width: 120,
  },
  {
    title: I18N.certificationReviewCenter.data,
    dataIndex: 'authType',
    width: 180,
    render: (authType, record) => {
      const dataObj = {
        1: `${I18N.certificationReviewCenter.enterpriseCarbonAccounting}${record.year}${I18N.Factors.year}`,
        2: record?.year || '-',
        3: record?.year || '-',
      };
      return dataObj[authType as 1 | 2 | 3];
    },
  },
  {
    title: I18N.eca.submissionTime,
    dataIndex: 'subTime',
    width: 180,
  },
  {
    title: I18N.Factors.state,
    dataIndex: 'authAuditStatus_name',
    width: 100,
    render: (value: string, record) => {
      return (
        <CustomTag
          color={
            authAuditStatusDataColor[
              record.authAuditStatus as unknown as keyof typeof authAuditStatusDataColor
            ]
          }
          text={value || '-'}
        />
      );
    },
  },
  {
    title: I18N.certificationReviewCenter.reviewTime,
    dataIndex: 'auditTime',
    width: 180,
  },
  {
    title: I18N.Factors.operation,
    dataIndex: 'id',
    fixed: 'right',
    width: locale === 'en-US' ? 280 : 200,
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            [0, 3, 4].indexOf(Number(record?.authAuditStatus)) >= 0 &&
              checkAuth('/certificationReviewCenter:edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  // reportFn?.(record);
                  if (Number(record.authType) === 2) {
                    const url = virtualLinkTransform(
                      CertifiCatioinReviewCenterMaps.certificationReviewCenterFootprintLInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.edit, id],
                    );
                    navigate(`${url}?assessmentId=${record.dataId}`);
                  } else if (Number(record.authType) === 3) {
                    navigate(
                      virtualLinkTransform(
                        CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.edit, id],
                      ),
                    );
                  } else {
                    navigate(
                      virtualLinkTransform(
                        CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.edit, id],
                      ),
                    );
                  }
                },
              }),
            [1].indexOf(Number(record?.authAuditStatus)) >= 0 &&
              checkAuth('/certificationReviewCenter:reject', {
                label: I18N.eca.withdraw,
                key: I18N.eca.withdraw,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <div>
                        {I18N.certificationReviewCenter.confirmWithdrawalOfThe}
                      </div>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      await getSubmitAuthData({
                        authAuditStatus: 4,
                        authId: record.id,
                      });
                      refresh?.();
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              }),

            checkAuth('/certificationReviewCenter:detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                if (Number(record.authType) === 2) {
                  const url = virtualLinkTransform(
                    CertifiCatioinReviewCenterMaps.certificationReviewCenterFootprintLInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  );
                  navigate(`${url}?assessmentId=${record.dataId}`);
                } else if (Number(record.authType) === 3) {
                  navigate(
                    virtualLinkTransform(
                      CertifiCatioinReviewCenterMaps.certificationReviewCenterCbamInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                } else {
                  navigate(
                    virtualLinkTransform(
                      CertifiCatioinReviewCenterMaps.certificationReviewCenterEcaInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                }
              },
            }),
            [0, 3, 4].indexOf(Number(record?.authAuditStatus)) >= 0 &&
              checkAuth('/certificationReviewCenter:submit', {
                label: I18N.dashborad.submit,
                key: I18N.dashborad.submit,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <div>
                        <div>
                          {
                            I18N.certificationReviewCenter
                              .confirmSubmissionOfThis
                          }
                        </div>
                        <div>
                          {I18N.certificationReviewCenter.hasItBeenUploaded}
                        </div>
                        <Radio.Group defaultValue={1}>
                          <Radio value={1}>{I18N.eca.yes}</Radio>
                          <Radio value={2}>{I18N.eca.no}</Radio>
                        </Radio.Group>
                      </div>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      await getSubmitAuthData({
                        authAuditStatus: 1,
                        authId: record.id,
                      });
                      refresh?.();
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              }),
            [0, 3, 4].indexOf(Number(record?.authAuditStatus)) >= 0 &&
              checkAuth('/certificationReviewCenter:del', {
                label: I18N.Factors.delete,
                key: I18N.Factors.delete,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    icon: '',
                    content: (
                      <div>
                        {I18N.certificationReviewCenter.confirmDeletionOfThis}
                      </div>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      await geAuthDataDel({
                        id: `${record.id}`,
                      });
                      refresh?.();
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              }),
          ])}
        />
      );
    },
  },
  {
    title: I18N.certificationReviewCenter.applu,
    dataIndex: 'authFile',
    fixed: 'right',
    width: 200,
    render(authFile, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/certificationReviewCenter:downLoad', {
              label: I18N.certificationReviewCenter.downloadReport,
              key: I18N.certificationReviewCenter.downloadReport,
              onClick: async () => {
                reportFn?.(record);
              },
            }),
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const orgs = UseOrgs();
  const AuthTypeOptions = AuthTypeOptionsArr();
  const AuthAuditStatusOptions = AuthAuditStatusOptionsArr();

  return {
    type: 'object',
    properties: {
      authNo: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.certificationReviewCenter.auditDocumentNumber,
        widget: 'input',
      }),
      authName: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.certificationReviewCenter.auditDocumentName,
        widget: 'input',
      }),
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.carbonData.affiliatedOrganization,
        enum: compact(orgs.map(u => String(u.id))),
        enumNames: compact(orgs.map(u => u.orgName)),
        widget: 'select',
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
      authType: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.certificationReviewCenter.auditDocumentClass,
        enum: compact(
          AuthTypeOptions?.map((u: { value: any }) => String(u.value)),
        ),
        enumNames: compact(AuthTypeOptions?.map(u => u.label)),
        widget: 'select',
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
      authAuditStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.Factors.state,
        enum: (AuthAuditStatusOptions || []).map(u => String(u.value)),
        enumNames: (AuthAuditStatusOptions || []).map(u => u.label),
        widget: 'select',
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
    },
  };
};
