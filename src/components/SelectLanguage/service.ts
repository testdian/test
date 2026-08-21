import { request, ResponseData } from '@src/api/request';

export interface OptionsType {
  fieldKey: number;
  fieldValue: string;
  i18nType: number;
  id: number;
  langType: number;
}

/**
 * @description 多语言列表
 */
export const getLangList = ({ langType }: { langType: number }) =>
  request<ResponseData<OptionsType[]>>({
    method: 'GET',
    url: `/auth/token/lang/${langType}`,
  });
