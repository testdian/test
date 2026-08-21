import { getSystemAppConfigInit } from '@/sdks_v2/new/systemV2ApiDocs';

export const systemInitFn = async () => {
  await getSystemAppConfigInit({});
};
