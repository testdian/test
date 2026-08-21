/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 16:42:19
 */
import I18N from '@src/lang/I18N';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { COLOR, ColorTag } from '@/components/ColorTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { OrgTree } from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';
import { modalText, modelFooterBtnStyle, Toast } from '@/utils';

import { STATUS } from './constant';
import { postOrgStatus } from '../service';

/**  组织类型。1 集团 2 分子公司 3 部门 0 单体组织 */
// export enum OrgTypes {
//   I18N.dashborad.monomerOrganization,
//   I18N.dashborad.group,
//   I18N.dashborad.subsidiaryCompanies,
//   I18N.dashborad.department,
// }

const { ENABLE, DISABLE } = STATUS;

export const columns = ({
  navigate,
  refresh,
}: {
  navigate: NavigateFunction;
  refresh: TableContext['refresh'];
}): TableRenderProps['columns'] => {
  const pageTo = (page: PageTypeInfo, row: OrgTree) => {
    navigate(
      virtualLinkTransform(
        RouteMaps.orgsAdd,
        [PAGE_TYPE_VAR, ':upOrgId', ':pId'],
        [page, row.code, row.pcode],
      ),
    );
  };
  return [
    {
      title: I18N.carbonData.organizationName,
      dataIndex: 'name',
      ellipsis: true,
      width: 300,
    },
    {
      title: I18N.dashborad.organizationalAbbreviation,
      dataIndex: 'abbr',
    },
    // {
    //   title: I18N.dashborad.organizationalType,
    //   dataIndex: 'orgType_name',
    // },
    {
      title: I18N.dashborad.organizationalCode,
      dataIndex: 'orgCode',
      // render(val, row, i) {
      //   return i === 0 ? '-' : val || '-';
      // },
    },
    {
      title: I18N.Factors.state,
      dataIndex: 'orgStatus',
      width: 80,
      render: (value, record) => {
        const status = {
          [ENABLE]: COLOR.green,
          [DISABLE]: COLOR.grey,
        } as {
          [key: number]: keyof typeof COLOR;
        };
        return (
          <ColorTag
            color={status[Number(value)]}
            text={record?.orgStatus_name}
          />
        );
      },
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
      ellipsis: false,
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'act',
      width: 340,
      render(_: any, row: OrgTree) {
        const { code, orgStatus, name } = row;
        /** 启用/禁用 按钮 */
        const text =
          orgStatus === ENABLE ? I18N.Factors.disabled : I18N.Factors.enable;
        /** 启用/禁用 文案 */
        const textBase =
          orgStatus === ENABLE ? I18N.base.disabled : I18N.base.enable;
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/org/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: async () => {
                  if (row.code) pageTo(PageTypeInfo.edit, row);
                },
              }),
              // !([1, 4].includes(Number(row.orgType)) || row.pcode === 0) &&
              //   checkAuth('/sys/org/del', {
              //     label: '删除',
              //     key: '删除',
              //     onClick: async ev => {
              //       ev.stopPropagation();
              //       modal.confirm({
              //         title: '提示',
              //         content: (
              //           <span>
              //             确定删除该组织：
              //             <span className={modalText}>{row?.name}？</span>
              //           </span>
              //         ),
              //         ...returnNoIconModalStyle,
              //         ...returnDelModalStyle,
              //         onOk: () => {
              //           if (row.code)
              //             postSystemOrgDelete({
              //               req: { id: row.code },
              //             }).then(({ data }) => {
              //               if (data.code === 200) {
              //                 message.success('删除成功');
              //                 refresh?.({ stay: true, tab: 1 });
              //               }
              //             });
              //         },
              //       });

              //       return null;
              //     },
              //   }),
              // 启用/禁用 => 禁用/启用按钮 根组织不可操作
              row.pcode !== 0 &&
                checkAuth('/supplyChain/supplierManagement/status', {
                  label: text,
                  key: text,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      icon: '',
                      content: (
                        <span>
                          {I18N.Factors.areYouSureYouWantTo}
                          {textBase}
                          {I18N.dashborad.thisOrg}
                          <span className={modalText}>{name}</span>
                        </span>
                      ),
                      ...modelFooterBtnStyle,
                      okText: I18N.base.confirm,
                      cancelText: I18N.Factors.cancel,
                      onOk: () => {
                        if (!code) return {};
                        return postOrgStatus({
                          id: code,
                          status:
                            Number(orgStatus) === ENABLE ? DISABLE : ENABLE,
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
              checkAuth('/sys/org/detail', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: async () => {
                  if (row.code) pageTo(PageTypeInfo.show, row);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};

export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {},
});
