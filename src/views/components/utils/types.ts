/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-27 19:18:00
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-31 11:27:39
 */
export type SearchParamses = {
  likeUsername?: string;
  current: number;
  pageSize?: number;
};

export interface FileListType {
  name: string;
  url: string;
  uid: string;
  suffix: string;
  fileName?: string;
}

export interface FileType {
  name: string;
  url: string;
  fileName?: string;
}
