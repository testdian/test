import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { FormLabelWithNote } from '@/components/ModifyNote';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { modalText, returnNoIconModalStyle, Toast } from '@/utils';
import { CustomTag } from '@/views/components/CustomTag';

import { updateUserStatusApi } from './service';
import { UserResp } from './type';

/** 内部用户列表列配置 */
export const userColumns = ({
  refresh,
  onView,
  onEdit,
}: {
  refresh: TableContext['refresh'];
  onView: (row: UserResp) => void;
  onEdit: (row: UserResp) => void;
}): TableRenderProps<UserResp>['columns'] => [
  {
    title: '姓名',
    dataIndex: 'realName',
    fixed: 'left',
  },
  {
    title: '工号',
    dataIndex: 'a0190',
  },
  {
    title: '核算组织',
    dataIndex: 'orgNames',
  },
  {
    title: '直接上级工号',
    dataIndex: 'leadera0190v',
  },
  {
    title: '直接上级姓名',
    dataIndex: 'leadera0101v',
  },
  {
    title: '部门全称',
    dataIndex: 'deptpath',
  },
  {
    title: '所属单位',
    dataIndex: 'gscompany',
  },
  {
    title: '钉钉ID',
    dataIndex: 'dingdingid',
  },
  {
    title: '角色',
    dataIndex: 'roleNames',
  },
  {
    title: '状态',
    dataIndex: 'userStatus_name',
    width: 120,
    render: (value, record) => {
      /** 0 - 启用 1 - 禁用 */
      const status = {
        0: 'green',
        1: 'red',
      };
      return (
        <CustomTag
          color={status[record.userStatus as keyof typeof status]}
          text={(value as string) || '-'}
        />
      );
    },
  },
  {
    title: '说明',
    dataIndex: 'userSource_name',
    width: 100,
  },
  {
    title: I18N.Factors.operation,
    width: 180,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth(
              '/sys/user/status',
              !row.adminFlag && {
                label:
                  Number(row.userStatus) !== 0
                    ? I18N.Factors.enable
                    : I18N.Factors.disabled,
                key: I18N.Factors.enable,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    content: (
                      <span>
                        {`${I18N.Factors.areYouSureYouWantTo} `}
                        {Number(row.userStatus) !== 0
                          ? I18N.Factors.enable1
                          : I18N.Factors.disabled1}
                        {`  ${I18N.dashborad.thisUser}`}
                        <span className={modalText}>
                          {row.realName || row.a0101 || row.username}
                        </span>
                      </span>
                    ),
                    ...returnNoIconModalStyle,
                    onOk: () => {
                      return updateUserStatusApi({
                        id,
                        userStatus: Number(row.userStatus) === 0 ? 1 : 0,
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast(
                            'success',
                            I18N.template(I18N.dashborad.number, {
                              val1:
                                Number(row.userStatus) !== 0
                                  ? I18N.Factors.enable
                                  : I18N.Factors.disabled,
                            }),
                          );
                          refresh?.({ stay: true, tab: 1 });
                        }
                      });
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              },
            ),
            checkAuth('/sys/user/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async ev => {
                ev.stopPropagation();
                if (row.id) onView(row);
              },
            }),
            checkAuth('/sys/user/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                if (row.id) onEdit(row);
              },
            }),
          ])}
        />
      );
    },
  },
];

/** 外部用户列表列配置 */
export const externalUserColumns = ({
  refresh,
  onView,
  onEdit,
}: {
  refresh: TableContext['refresh'];
  onView: (row: UserResp) => void;
  onEdit: (row: UserResp) => void;
}): TableRenderProps<UserResp>['columns'] => [
  {
    title: (
      <FormLabelWithNote
        label='账号'
        note='列表页在供应商名称前增加：账号，搜索项增加：账号，模糊搜索'
      />
    ),
    dataIndex: 'username',
    fixed: 'left',
  },
  {
    title: '供应商全称',
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: '供应商编码',
    dataIndex: 'supplierCode',
  },
  {
    title: '核算组织',
    dataIndex: 'orgNames',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '角色',
    dataIndex: 'roleNames',
  },
  {
    title: '状态',
    dataIndex: 'userStatus_name',
    width: 120,
    render: (value, record) => {
      /** 0 - 启用 1 - 禁用 */
      const status = {
        0: 'green',
        1: 'red',
      };
      return (
        <CustomTag
          color={status[record.userStatus as keyof typeof status]}
          text={(value as string) || '-'}
        />
      );
    },
  },
  {
    title: I18N.Factors.operation,
    width: 180,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth(
              '/sys/user/status',
              !row.adminFlag && {
                label:
                  Number(row.userStatus) !== 0
                    ? I18N.Factors.enable
                    : I18N.Factors.disabled,
                key: I18N.Factors.enable,
                onClick: async () => {
                  modal.confirm({
                    title: I18N.Factors.prompt,
                    content: (
                      <span>
                        {`${I18N.Factors.areYouSureYouWantTo} `}
                        {Number(row.userStatus) !== 0
                          ? I18N.Factors.enable1
                          : I18N.Factors.disabled1}
                        {`  ${I18N.dashborad.thisUser}`}
                        <span className={modalText}>
                          {row.supplierName || row.username}
                        </span>
                      </span>
                    ),
                    ...returnNoIconModalStyle,
                    onOk: () => {
                      return updateUserStatusApi({
                        id,
                        userStatus: Number(row.userStatus) === 0 ? 1 : 0,
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast(
                            'success',
                            I18N.template(I18N.dashborad.number, {
                              val1:
                                Number(row.userStatus) !== 0
                                  ? I18N.Factors.enable
                                  : I18N.Factors.disabled,
                            }),
                          );
                          refresh?.({ stay: true, tab: 1 });
                        }
                      });
                    },
                    okText: I18N.base.confirm,
                    cancelText: I18N.Factors.cancel,
                  });
                },
              },
            ),
            checkAuth('/sys/user/detail', {
              label: I18N.Factors.check,
              key: I18N.Factors.check,
              onClick: async ev => {
                ev.stopPropagation();
                if (row.id) onView(row);
              },
            }),
            checkAuth('/sys/user/edit', {
              label: I18N.Factors.edit,
              key: I18N.Factors.edit,
              onClick: async () => {
                if (row.id) onEdit(row);
              },
            }),
          ])}
        />
      );
    },
  },
];
