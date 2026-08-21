/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-01-13 16:28:10
 */

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export interface PageQueryParams {
  page: number;
  size: number;
}

export interface PageResponseData {
  dataTotal?: number;
  pageTotal?: number;
  page?: number;
  size?: number;
}

export interface QueryListResponseData<T> {
  list: T[];
  page: PageResponseData;
}
