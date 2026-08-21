import { ProColumns } from '@ant-design/pro-components';
import { compact } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { modal } from '@/store/module/notification';
import { ActionTypeEnum } from '@/utils/actionType';

import { ConfigDataRow } from '../type';

/**
 * 生成数据表格列配置
 * @param columns 基础列配置
 * @param isDetail 是否为详情模式
 * @returns 完整的列配置
 */
export const generateDataTableColumns = (
  columns: ProColumns<ConfigDataRow>[],
  isDetail: boolean,
  handelActionType: (type: ActionTypeEnum, record: ConfigDataRow) => void,
): ProColumns<ConfigDataRow, 'text'>[] => {
  return compact([
    ...columns,
    !isDetail &&
      columns.length > 0 && {
        title: I18N.Factors.operation,
        width: 120,
        valueType: 'option',
        fixed: 'right',
        renderText: (_, record: ConfigDataRow) => {
          return (
            <TableActions
              menus={compact([
                checkAuth('/fillData/edit/edit', {
                  label: I18N.Factors.edit,
                  key: I18N.Factors.edit,
                  onClick: async () => {
                    handelActionType(ActionTypeEnum.EDIT, record);
                  },
                }),
                checkAuth('/fillData/edit/del', {
                  label: I18N.Factors.delete,
                  key: I18N.Factors.delete,
                  onClick: async () => {
                    modal.confirm({
                      title: I18N.Factors.prompt,
                      content: I18N.dashborad.pleaseConfirmIfItIs2,
                      onOk: async () => {
                        if (!record?.id) return;
                        handelActionType(ActionTypeEnum.DELETE, record);
                      },
                    });
                  },
                }),
              ])}
            />
          );
        },
      },
  ]);
};
