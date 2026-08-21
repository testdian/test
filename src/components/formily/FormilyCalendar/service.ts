import { request, ResponseData } from '@/api/request';

/**
 * 获取今年和明年的节假日信息
 */
export const getHoliday = () => {
  return request<
    ResponseData<
      {
        date: string;
        type: string;
      }[]
    >
  >({
    method: 'GET',
    url: '/system/lib/holiday',
  });
};
