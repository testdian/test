/**
 * @description 角色关联的用户列表弹窗
 */
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { TableRenderProps } from 'table-render/dist/src/types';

import { CustomTableRender } from '@/components/x-render/TableRender';
import { useTableRef } from '@/components/x-render/TableRender/hook/useTableRef';
import { USER_TYPE } from '@/views/dashborad/Users/constant';
import { getUserListApi } from '@/views/dashborad/Users/service';
import { UserReq } from '@/views/dashborad/Users/type';

const { INTERNAL, EXTERNAL } = USER_TYPE;

interface RoleUsersModalProps {
  visible: boolean;
  roleId?: number;
  roleName?: string;
  onClose: () => void;
}

const RoleUsersModal: React.FC<RoleUsersModalProps> = ({
  visible,
  roleId,
  roleName,
  onClose,
}) => {
  const { tableRef } = useTableRef();
  const [loading, setLoading] = useState(false);

  // 表格列配置
  const columns: TableRenderProps<UserReq>['columns'] = [
    {
      title: '用户类型',
      dataIndex: 'userType_name',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 120,
      render: (realName, record) => {
        // 外部用户显示 '-'
        return `${record.userType}` === EXTERNAL ? '-' : realName || '-';
      },
    },
    {
      title: '工号',
      dataIndex: 'a0190',
      width: 120,
      render: (a0190, record) => {
        // 外部用户显示 '-'
        return `${record.userType}` === EXTERNAL ? '-' : a0190 || '-';
      },
    },
    {
      title: '供应商全称',
      dataIndex: 'supplierName',
      width: 200,
      render: (supplierName, record) => {
        // 内部用户显示 '-'
        return `${record.userType}` === INTERNAL ? '-' : supplierName || '-';
      },
    },
    {
      title: '供应商编码',
      dataIndex: 'supplierCode',
      width: 150,
      render: (supplierCode, record) => {
        // 内部用户显示 '-'
        return `${record.userType}` === INTERNAL ? '-' : supplierCode || '-';
      },
    },
  ];

  // 获取用户列表数据
  const searchApi = async ({ current, pageSize }: any) => {
    if (!roleId) return { rows: [], total: 0 };

    setLoading(true);
    try {
      const { data } = await getUserListApi({
        pageNum: current,
        pageSize,
        roleId: roleId as any,
      });
      return {
        rows: data?.data?.list || [],
        total: data?.data?.total || 0,
      };
    } catch (error) {
      return { rows: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  // 当弹窗打开且有 roleId 时，刷新表格
  useEffect(() => {
    if (visible && roleId) {
      tableRef.current?.refresh();
    }
  }, [visible, roleId]);

  return (
    <Modal
      title={`${roleName || '角色'} - 关联用户列表`}
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose
    >
      <CustomTableRender
        tableRef={tableRef}
        searchProps={{
          schema: { type: 'void', properties: {} },
          hidden: true,
          api: searchApi,
        }}
        tableProps={{
          columns,
          loading,
          scroll: { y: '50vh' },
        }}
        autoFixNoText
        autoAddIndexColumn
      />
    </Modal>
  );
};

export default RoleUsersModal;
