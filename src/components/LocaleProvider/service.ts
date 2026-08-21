import { request, ResponseData } from '@src/api/request';

/**
 * @description 切换语言
 */
export const getChangeLang = (params: { langType: number }) =>
  request<ResponseData>({
    method: 'GET',
    url: `/auth/token/switch/${params.langType}`,
  });

/**
 * @description 获取当前语言
 */
export const getLanguage = async () => {
  const { data } = await request<ResponseData<number>>({
    method: 'GET',
    url: `/system/i18n/userLang`,
  });

  return data.data;
};
