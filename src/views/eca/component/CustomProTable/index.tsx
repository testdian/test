import {
  ProColumns,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';
import { isArray } from 'lodash-es';
import { useState } from 'react';

import I18N from '@/lang/I18N';

import style from './index.module.less';

interface CustomProTableProps extends ProTableProps<any, any> {
  columns: ProColumns<any>[];
  apiRequest: (params: any) => Promise<any>;
  toolBarRender: ProTableProps<any, any>['toolBarRender'];
  requestParams?: Partial<any>;
  searchFlag?: boolean;
  handleRequestParams?: (params: any) => Partial<any>;
}

const CustomProTable: React.FC<CustomProTableProps> = ({
  requestParams,
  columns,
  apiRequest,
  searchFlag = true,
  toolBarRender,
  handleRequestParams,
  ...rest
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  return (
    <div className={style.projectPublicityTable}>
      <ProTable
        rowKey='id'
        className={style.projectTable}
        ghost
        options={false}
        columns={columns}
        request={async params => {
          const { current = 1 } = params;

          // 如果有处理参数方法
          const result = handleRequestParams
            ? handleRequestParams(params)
            : params;

          const { data } = await apiRequest({
            ...result,
            ...requestParams,
            pageNum: current,
            pageSize,
          });

          if (isArray(data?.data)) {
            setTotal(data?.data?.length || 0);
            return {
              data: data?.data,
              success: true,
              total: data?.data?.length,
            };
          }

          setTotal(data?.data?.total || 0);
          return {
            data: data?.data?.list,
            success: true,
            total: data?.data?.total,
          };
        }}
        search={
          !searchFlag
            ? false
            : {
                layout: 'vertical',
                defaultCollapsed: false,
                collapseRender: () => null,
                searchText: I18N.prodManagement.query,
                resetText: I18N.prodManagement.reset,
              }
        }
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          size: 'small',
          showTotal: () => undefined,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        toolBarRender={toolBarRender}
        {...rest}
      />
    </div>
  );
};

export default CustomProTable;
