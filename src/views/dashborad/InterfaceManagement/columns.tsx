import { compact } from 'lodash-es';
import { ProColumnsType } from 'table-render';

import { TableActions } from '@/components/Table/TableActions';
import I18N from '@/lang/I18N';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';

import { InterFaceList } from './type';

/**
 * dataTransStatus	数据同步状态。1 获取成功；2 获取失败；3 已删除；4 执行成功，无数据；(1:获取成功; 2:获取失败; 3:已删除; 4:执行成功，无数据;),可用值:1,2,3,4
 */

// const DataStatus = {
//   /** 获取成功 */
//   Success: 1,
//   /** 获取失败 */
//   Failure: 2,
//   /** 已删除 */
//   Deleted: 3,
//   /** 执行成功，无数据 */
//   SuccessNoData: 4,
// };

export const columns = ({
  onActionsType,
}: {
  onActionsType: (type: string, id: number) => void;
}): ProColumnsType<InterFaceList> => {
  return [
    {
      title: I18N.dashborad.interfaceName,
      dataIndex: 'interfaceType_name',
    },
    {
      title: I18N.dashborad.batchNumber,
      dataIndex: 'batchNo',
    },
    {
      title: I18N.dashborad.pushTime,
      dataIndex: 'pushTime',
    },
    // {
    //   title: I18N.dashborad.deleteTime,
    //   dataIndex: 'deleteTime',
    // },
    {
      title: I18N.dashborad.totalNumberOfDataEntries,
      dataIndex: 'totalNum',
    },
    {
      title: I18N.dashborad.abnormalDataStrip,
      dataIndex: 'warningNum',
    },
    // {
    //   title: I18N.dashborad.dataStatus,
    //   dataIndex: 'dataTransStatus_name',
    // },
    {
      title: I18N.Factors.operation,
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => {
        /** 展示重新获取按钮：状态为获取失败、执行成功，无数据、获取成功但异常条数大于0 */
        // const showReloadButton =
        //   record.dataTransStatus === DataStatus.Failure ||
        //   record.dataTransStatus === DataStatus.SuccessNoData ||
        //   (record.dataTransStatus === DataStatus.Success &&
        //     Number(record?.warningNum) > 0);

        return (
          <TableActions
            menus={compact([
              // showReloadButton &&
              //   checkAuth('/interfaceManagement/getData', {
              //     label: I18N.dashborad.retrieve,
              //     key: I18N.dashborad.retrieve,
              //     onClick: () => {
              //       onActionsType('reload', record.id);
              //     },
              //   }),
              checkAuth('/interfaceManagement/show', {
                label: I18N.Factors.check,
                key: I18N.Factors.check,
                onClick: () => {
                  onActionsType(PageTypeInfo.show, record.id);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
