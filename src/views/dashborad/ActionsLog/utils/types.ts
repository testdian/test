/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-12 18:15:21
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-01-12 18:15:38
 */
export type SearchParamses = {
  time?: string[] | string;
  moduleType?: string;
  likeUsername?: string;
  current: number;
  pageSize?: number;
};
