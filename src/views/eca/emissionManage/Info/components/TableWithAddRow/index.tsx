import {
  EditableProTable,
  EditableProTableProps,
} from '@ant-design/pro-components';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { useState } from 'react';

import { InfoTitle } from '@/components/InfoTitle';
import { Factor } from '@/sdks/systemV2ApiDocs';
import { modal } from '@/store/module/notification';

import { deleteEmissionSourceFactorApi } from '../../../service';
import { EmissionSourceParam } from '../../../type';
import { generateColumns } from '../../ChooseTemplateParams/utils';

interface TableWithAddRowProps extends EditableProTableProps<any, any> {
  item: EmissionSourceParam;
  factorDetail: Factor[];
  templateParamsList: EmissionSourceParam[];
  /** 点击columns中的选择因子按钮 */
  onSelectEmissionFactor: (item: EmissionSourceParam, index: number) => void;
  /** 点击columns中的删除按钮 */
  handleDelete: (item: any) => void;
  /** 编辑行的key */
  editableKeys: React.Key[];
  /** 设置编辑行的key */
  setEditableRowKeys: (keys: React.Key[]) => void;
  /** 表格的actionRef */
  actionRef: any;
  /** 删除所有成功后的回调 */
  onDeleteAllSuccess: () => void;
  /** 输入框失去焦点 */
  onBlurChange: (value: string, param: EmissionSourceParam) => void;
}
const TableWithAddRow = ({
  item,
  templateParamsList,
  factorDetail,
  onSelectEmissionFactor,
  handleDelete,
  editableKeys,
  setEditableRowKeys,
  actionRef,
  onDeleteAllSuccess,
  onBlurChange,
  ...rest
}: TableWithAddRowProps) => {
  const currentDataSource = item.factorList || [];
  const [localDataSource, setLocalDataSource] = useState(currentDataSource);

  const toolBarRender = () => {
    return [
      <Button
        type='primary'
        key='save'
        onClick={async () => {
          modal.confirm({
            title: I18N.eca.confirmToDelete,
            okText: I18N.carbonFootPrintLCA.confirm,
            cancelText: I18N.Factors.cancel,
            onOk: async () => {
              await deleteEmissionSourceFactorApi(item.emissionSourceFactorId);
              onDeleteAllSuccess();
            },
          });
        }}
      >
        {I18N.eca.deleteAll}
      </Button>,
    ];
  };
  return (
    <div>
      <EditableProTable
        rowKey='id'
        size='small'
        columns={generateColumns(
          // @ts-ignore
          item,
          templateParamsList,
          factorDetail,
          onSelectEmissionFactor,
          handleDelete,
          onBlurChange,
        )}
        value={localDataSource}
        onChange={setLocalDataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
            name: undefined,
            unit: undefined,
            factorValue: undefined,
          }),
        }}
        headerTitle={<InfoTitle title={item?.mainParamName || ''} />}
        toolBarRender={toolBarRender}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onChange: (editableKeys: React.Key[], editableRows: any) => {
            console.log('editableKeys', editableKeys);
            console.log('editableRows', editableRows);
            setEditableRowKeys(editableKeys);
          },
        }}
        actionRef={actionRef}
        {...rest}
      />
    </div>
  );
};

export default TableWithAddRow;
