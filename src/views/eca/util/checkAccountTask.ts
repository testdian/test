import { getAccountModelDetailApi } from '../accountingModel/Info/service';
import { AccountingModelDataDatum } from '../carbonMissionAccounting/type';

export const fetchAccountModelDetail = async (modelId: string | number) => {
  const { data } = await getAccountModelDetailApi(Number(modelId));
  return (data?.data as AccountingModelDataDatum) || {};
};
