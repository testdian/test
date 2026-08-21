/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-23 17:46:04
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-23 17:59:48
 */
import { useEffect, useState } from 'react';

import { getSystemRolePage, Role } from '@/sdks/systemV2ApiDocs';

export const useRoles = () => {
  const [role, setRole] = useState<Role[]>([]);

  useEffect(() => {
    getSystemRolePage({ pageNum: 1, pageSize: 99999 }).then(({ data }) => {
      setRole(data?.data?.list || []);
    });
  }, []);
  return role;
};
