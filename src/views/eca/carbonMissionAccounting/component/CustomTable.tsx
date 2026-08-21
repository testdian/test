/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-02 15:47:40
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-28 11:05:36
 */
import { Field } from '@formily/core';
import { useField, useForm } from '@formily/react';
import { Table } from 'antd';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';

export const CustomTable = (props: any) => {
  const { pageTypeInfo, CarbonMissionPageInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
    CarbonMissionPageInfo: PageTypeInfo;
    id: string;
  }>();
  const filed = useField<Field>();
  const form = useForm();
  return (
    <Table
      {...props}
      columns={props.colums}
      dataSource={props?.dataSource}
      disable
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: filed.value,
        onChange: selectRowKeys => {
          props.onChange(selectRowKeys);
        },
        getCheckboxProps: record => {
          return {
            disabled:
              pageTypeInfo !== 'show'
                ? CarbonMissionPageInfo === 'show'
                  ? true
                  : record.code === form.getFieldState('orgId').value
                : true, // Column configuration not to be checked
          };
        },
      }}
      rowKey={record => record.code}
    />
  );
};
