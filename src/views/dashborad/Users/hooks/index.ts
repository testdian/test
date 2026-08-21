import { useEffect, useState } from 'react';

import { getAllUserListApi } from '../../EmailTemplate/service';
import { USER_TYPE } from '../constant';
import { UserReq } from '../type';

export const useUsers = (prop?: UserReq) => {
  const [user, setUser] = useState<any[]>([]);

  useEffect(() => {
    getAllUserListApi({
      // pageNum: 1,
      // pageSize: 200000,
      userType: USER_TYPE.INTERNAL,
      ...prop,
    }).then(({ data }) => {
      setUser(data?.data || []);
    });
  }, []);
  return user;
};
