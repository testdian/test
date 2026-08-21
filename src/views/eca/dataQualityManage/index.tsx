/**
 * @description 数据质量管理列表
 */

import { PlusOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import {
  ControlPlan,
  getComputationControlPlanPage,
  getComputationControlPlanPageProps as SearchApiProps,
} from '@/sdks/computation/computationV2ApiDocs';

import { columns, SearchSchema } from './utils/columns';
import { DataQualityModel } from './utils/model';

export enum Status {
  'ADD',
  'SHOW',
  'EDIT',
  'COPY',
  'DEL',
}
export const StatusText = {
  ADD: I18N.Factors.newAddition,
  SHOW: I18N.eca.display,
  EDIT: I18N.Factors.edit,
  COPY: I18N.carbonFootPrintLCA.copy,
  DEL: I18N.Factors.delete,
} as const;

const DataQualityManage = () => {
  const navigage = useNavigate();

  /** 用于缓存record**/
  const [cathRecord, getCathRecord] = useState<ControlPlan>({});

  // 控制计划弹窗显隐
  const [visible, setVisible] = useState(false);
  // 控制计划 当前状态  ADD SHOW COPY
  const [status, setStatus] = useState<
    'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL'
  >('ADD');
  const { refresh, tableRef } = useTable();

  const searchApi: CustomSearchProps<ControlPlan, SearchApiProps> = args => {
    return getComputationControlPlanPage(args).then(({ data }) => {
      return data?.data || {};
    });
  };

  // 编辑
  const editFn = (record: ControlPlan) => {
    setVisible(true);
    setStatus('EDIT');
    getCathRecord({
      ...record,
    });
  };
  // 复制
  const copyDataFn = (record: ControlPlan) => {
    setVisible(true);
    setStatus('COPY');
    getCathRecord({
      ...record,
      version: '',
      planDate: dayjs().format('YYYY-MM-DD'),
    });
  };

  return (
    <Page
      title={I18N.eca.dataQualityControl3}
      onBtnClick={async () => {
        setStatus('ADD');
        setVisible(true);
        getCathRecord({
          planDate: dayjs().format('YYYY-MM-DD'),
        });
      }}
      actionBtnChild={checkAuth(
        '/dataQualityManage/add',
        <div>
          <PlusOutlined /> {I18N.Factors.newAddition}
        </div>,
      )}
    >
      <CustomTableRender<ControlPlan, SearchApiProps>
        tableRef={tableRef}
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({
            navigage,
            editFn,
            copyDataFn,
            refresh,
          }),
          scroll: { x: 1200 },
          pagination: {
            showSizeChanger: true,
          },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      {/* 新增控制计划抽屉 */}
      <DataQualityModel
        status={status}
        visible={visible}
        onCancelFn={() => {
          setVisible(false);
        }}
        onOkFn={() => {
          setVisible(false);
          refresh?.();
        }}
        initValue={cathRecord}
      />
    </Page>
  );
};

export default DataQualityManage;
