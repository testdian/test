/**
 * @description 核查计划管理 - 列定义
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch, Tooltip } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { CarbonVerifyRouteMaps } from '@/router/utils/carbonVerifyEnum';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import { modal } from '@/store/module/notification';
import { returnDelModalStyle, returnNoIconModalStyle, Toast } from '@/utils';

import { deleteVerificationPlanApi, editVerificationPlanApi } from './service';
import { VerificationPlanItem } from './type';

export const columns = ({
  refresh,
  navigate,
}: {
  refresh: TableContext['refresh'];
  navigate: NavigateFunction;
}): TableRenderProps<VerificationPlanItem>['columns'] => [
  {
    title: '核算年度',
    dataIndex: 'year',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '通知计划发送时间',
    dataIndex: 'notifySchedule',
    width: 200,
  },
  {
    title: (
      <div>
        钉钉通知发送开关
        <Tooltip title='开启后，将在计划开始日期前1天和当天，对填报角色关联的所有用户进行钉钉提醒，提醒内容为计划中填写的内容。如开启时已过发送时间，则不发送通知。'>
          <QuestionCircleOutlined />
        </Tooltip>
      </div>
    ),
    dataIndex: 'sendMessage',
    width: 200,
    render: (value, record) => (
      <Switch
        checked={!!value}
        onChange={async checked => {
          if (record.id) {
            await editVerificationPlanApi({
              ...record,
              id: record.id,
              sendMessage: checked,
            });
            refresh?.({ stay: true, tab: 1 });
          }
        }}
      />
    ),
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: 180,
    render: (id, record) => (
      <TableActions
        menus={compact([
          checkAuth('', {
            label: '编辑',
            key: '编辑',
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  CarbonVerifyRouteMaps.verificationPlanInfo,
                  [':pageTypeInfo', ':id'],
                  [PageTypeInfo.edit, id],
                ),
              );
            },
          }),
          checkAuth('', {
            label: '删除',
            key: '删除',
            onClick: () => {
              modal.confirm({
                title: I18N.Factors.prompt,
                content: `确认删除该年度核查计划：${record?.year || '-'} ？`,
                ...returnNoIconModalStyle,
                ...returnDelModalStyle,
                onOk: async () => {
                  await deleteVerificationPlanApi({ id });
                  Toast('success', I18N.Factors.deleteSuccessful);
                  refresh?.({ stay: true, tab: 1 });
                },
                okText: I18N.base.confirm,
                cancelText: I18N.Factors.cancel,
              });
            },
          }),
          checkAuth('', {
            label: '查看',
            key: '查看',
            onClick: async () => {
              navigate(
                virtualLinkTransform(
                  CarbonVerifyRouteMaps.verificationPlanInfo,
                  [':pageTypeInfo', ':id'],
                  [PageTypeInfo.show, id],
                ),
              );
            },
          }),
        ])}
      />
    ),
  },
];
