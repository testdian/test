import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { ActionTypeEnum } from '@/utils/const';

import { CONFIG_TYPE } from './constant';
import { ConfigurationListType } from './type';

const { EDIT, COPY, SHOW, DATA_MANAGE, DELETE } = ActionTypeEnum;

export const columns = ({
  handleActionClick,
}: {
  handleActionClick: (
    actionType: ActionTypeEnum,
    record: ConfigurationListType,
  ) => void;
}): TableRenderProps<ConfigurationListType>['columns'] => {
  return [
    {
      title: '核算年份',
      dataIndex: 'year',
      render: value => {
        return value === 0 ? '每年通用' : value || '-';
      },
    },
    {
      title: '主要参数名称',
      dataIndex: 'mainParamCodes',
    },
    {
      title: '关联参数名称',
      dataIndex: 'associatedParamCodes',
    },
    {
      title: '配置类型',
      dataIndex: 'paramConfigType_name',
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => {
        const { paramConfigType } = record || {};

        /** 是否是映射关系 */
        const isMapping = paramConfigType === CONFIG_TYPE.MAPPING_RELATION;

        return (
          <TableActions
            menus={compact([
              checkAuth('/otherConfiguration/edit', {
                label: I18N.Factors.edit,
                key: I18N.Factors.edit,
                onClick: () => {
                  if (record?.id) {
                    handleActionClick(EDIT, record);
                  }
                },
              }),
              checkAuth('/otherConfiguration/edit', {
                label: '复制',
                key: '复制',
                onClick: () => {
                  if (record?.id) {
                    handleActionClick(COPY, record);
                  }
                },
              }),
              isMapping &&
                checkAuth('/otherConfiguration/edit', {
                  label: '数据管理',
                  key: '数据管理',
                  onClick: () => {
                    if (record?.id) {
                      handleActionClick(DATA_MANAGE, record);
                    }
                  },
                }),
              checkAuth('/otherConfiguration/show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: () => {
                  if (record?.id) {
                    handleActionClick(SHOW, record);
                  }
                },
              }),
              checkAuth('/otherConfiguration/edit', {
                label: '删除',
                key: '删除',
                onClick: () => {
                  if (record?.id) {
                    handleActionClick(DELETE, record);
                  }
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
