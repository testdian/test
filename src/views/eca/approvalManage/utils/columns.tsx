import I18N from '@src/lang/I18N';
import { Button, Popover } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { auditDataColor, CustomTag } from '@/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { useAsyncEnums } from '@/hooks';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { AuditData } from '@/sdks/Newcomputation/computationV2ApiDocs';

import { ApproveUserList } from '../PendReviewModal';

export const columns = ({
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
  PendReviewModalFn?: (record: AuditData) => void;
}): TableRenderProps<AuditData>['columns'] => [
  {
    title: I18N.eca.reviewContent,
    dataIndex: 'auditType_name',
    width: 120,
    fixed: 'left',
    // copyable: true,
  },
  {
    title: I18N.carbonData.affiliatedOrganization,
    width: 120,
    dataIndex: 'orgName',
  },
  {
    title: I18N.eca.submitter,
    dataIndex: 'createByName',
    width: 120,
  },

  {
    title: I18N.eca.submissionTime,
    dataIndex: 'submitTime',
    width: 180,
  },
  {
    title: I18N.eca.reviewStatus,
    dataIndex: 'auditStatus',
    width: 180,
    render: (value: keyof typeof auditDataColor, record) => {
      return (
        <CustomTag
          color={auditDataColor[value]}
          text={record?.auditStatus_name || '-'}
        />
      );
    },
  },
  {
    title: I18N.eca.pendingReviewer,
    dataIndex: 'targetNames',
    ellipsis: true,
    width: 100,
    render: (targetNames, record) => {
      const content = (
        <div style={{ width: '500px' }}>
          <ApproveUserList id={record?.id || 0} />
        </div>
      );
      return Number(record?.auditStatus) === 0 ? (
        <Popover
          placement='left'
          title={I18N.eca.pendingReviewer}
          content={content}
          trigger='click'
        >
          <Button type='link' style={{ paddingLeft: 0 }}>
            {targetNames}
          </Button>
        </Popover>
      ) : (
        '-'
      );
    },
  },
  {
    title: I18N.eca.approvalTime,
    dataIndex: 'auditTime',
    width: 180,
  },
  {
    title: I18N.Factors.operation,
    width: 160,
    render(_, record) {
      const { id, dataId, auditStatus } = record || {};
      return (
        <TableActions
          menus={compact([
            Number(record?.auditStatus) === 0 &&
              record?.userBtnFlag === true &&
              checkAuth('/approvalManage/Info', {
                label: I18N.eca.auditing,
                key: I18N.eca.auditing,
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.approvalManageInfo,
                      [PAGE_TYPE_VAR, ':id', ':dataId', ':auditStatus'],
                      [PageTypeInfo.edit, id, dataId, auditStatus],
                    ),
                  );
                },
              }),
            checkAuth('/approvalManageInfo/Detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.approvalManageInfo,
                    [PAGE_TYPE_VAR, ':id', ':dataId', ':auditStatus'],
                    [PageTypeInfo.show, id, dataId, auditStatus],
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
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const DataStatus = useAsyncEnums('AuditStatus');

  return {
    type: 'object',
    properties: {
      auditStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: I18N.eca.reviewStatus,
        enum: DataStatus.map(org => String(org.code)),
        enumNames: DataStatus.map(org => org.name as string),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
