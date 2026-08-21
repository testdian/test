import { useEffect, useState } from 'react';

import { getSystemOrgUserList, OrgPojo } from '@/sdks/systemV2ApiDocs';

/** 获取用户下的所有组织 */
export const useOrgs = () => {
  const [orgs, setOrgs] = useState<OrgPojo[]>([]);
  useEffect(() => {
    getSystemOrgUserList({}).then(({ data }) => {
      setOrgs(data?.data || []);
    });
  }, []);
  return orgs;
};
