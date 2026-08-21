/*
 * @@description: 待审核人相关
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-01 11:42:58
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-18 22:06:48
 */
import I18N from '@src/lang/I18N';
import { Button, Modal, Popover } from 'antd';
import { ReactNode, useEffect, useState } from 'react';

import {
  AuditUserDto,
  getSupplychainAuditUserPage,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { SearchParamses } from '@/views/components/utils/types';

import style from './index.module.less';
import TableList from '../Table';
import { columns } from './utils/columns';

/** 待审核人的列表 */
export const ApproverList = ({ id }: { id?: number }) => {
  /** 页码参数 */
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 表格数据 */
  const [tableData, setTableData] = useState<AuditUserDto[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 表格loading */
  const [loading, changeLoading] = useState(false);

  useEffect(() => {
    if (id) {
      changeLoading(true);
      getSupplychainAuditUserPage({
        auditDataId: id,
        pageNum: searchParams.current || 1,
        pageSize: searchParams.pageSize || 10,
      }).then(({ data }) => {
        if (data.code === 200) {
          changeLoading(false);
          setTableData(data.data.list);
          setTotal(data.data.total || 0);
        }
      });
    }
  }, [id, searchParams]);
  return (
    <TableList
      loading={loading}
      columns={[...columns()]}
      dataSource={tableData}
      total={total}
      searchParams={searchParams}
      onchange={(current: number, pageSize: number) => {
        setSearchParams({
          current,
          pageSize,
        });
      }}
    />
  );
};

/** 待审核人的弹窗 */
export const ApproverModal = ({
  open,
  handleCancel,
}: {
  /** 弹窗的显隐 */
  open: boolean;
  /** 关闭弹窗的方法 */
  handleCancel: () => void;
}) => {
  return (
    <Modal
      centered
      title={I18N.eca.pendingReviewer}
      open={open}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          {I18N.carbonFootPrintLCA.close}
        </Button>,
      ]}
    >
      <ApproverList />
    </Modal>
  );
};

/** 待审核人的气泡卡片 */
export const ApproverPopover = ({
  id,
  children,
}: {
  /** 审核数据的id */
  id?: number;
  children: ReactNode;
}) => {
  return (
    <Popover
      placement='left'
      title={I18N.eca.pendingReviewer}
      content={
        <div className={style.approverPopover}>
          <ApproverList id={id} />
        </div>
      }
      trigger='click'
    >
      {children && <p className={style.childrenContent}>{children}</p>}
    </Popover>
  );
};
