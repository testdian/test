import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { ProColumnsType } from 'table-render';

import { checkAuth } from '@/layout/utills';

import { CodeConfigurationListType } from './type';

export const columns = (
  editCodeFn: (record: CodeConfigurationListType) => void,
): ProColumnsType<CodeConfigurationListType> => {
  return [
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: I18N.carbonFootPrintLCA.type,
      dataIndex: 'codeType_name',
    },
    {
      title: I18N.Factors.applicableScenarios,
      dataIndex: 'scene',
    },
    {
      title: I18N.dashborad.chineseDescription1,
      dataIndex: 'codeDesc',
    },
    {
      title: I18N.dashborad.description,
      dataIndex: 'codeDescEn',
    },
    {
      title: I18N.Factors.updatedBy,
      dataIndex: 'updateByName',
    },
    {
      title: I18N.Factors.updateTime,
      dataIndex: 'updateTime',
    },
    {
      title: I18N.Factors.operation,
      dataIndex: 'operation',
      fixed: 'right',
      render: (_, record) => {
        return checkAuth(
          '/code/edit',
          <Button
            type='link'
            onClick={() => {
              editCodeFn(record);
            }}
          >
            {I18N.Factors.edit}
          </Button>,
        );
      },
    },
  ];
};
