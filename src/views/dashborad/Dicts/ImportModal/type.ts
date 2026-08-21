export interface DownloadTemplateParams {
  fileName?: string;
  fileUrl?: string;
}
export interface FileBackParams {
  fileName: string;
  filePath: string;
  /* url */
  url: string;
}

export interface FileListParams {
  pageNum: number;
  pageSize: number;
  emissionSourceTemplateId: number;
}
