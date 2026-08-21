/*
 * @@description:
 */
import {
  ActionType,
  ProColumns,
  ProTable,
  ProTableProps,
} from '@ant-design/pro-components';
import { Button, Col, Row, Typography, Upload, UploadProps } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
// 引入 lodash 的节流函数
import { throttle } from 'lodash-es';
import { useRef, useState } from 'react';

import { baseUrl } from '@/api/request';
import I18N from '@/lang/I18N';
import { Toast } from '@/utils';
import { UPLOAD_FILES_URL_SALE } from '@/utils/const';
import { getToken } from '@/utils/cookie';

import style from './index.module.less';
import { IconFont } from '../IconFont';

const { Text } = Typography;

export type FileType = {
  name: string;
  uid: string;
  url: string;
  suffix: string;
  fileName?: string;
};

interface ImportFileProps<T, ParamsType> {
  /** 第一步模版提示文案 */
  templateTipsText: string;
  /** 上传文件的最大值 */
  maxSize: number;
  /** 表头信息 */
  columns: ProColumns<T>[];
  /** 表格列表需要的额外参数 */
  extraParams: ParamsType;
  /** 表格属性 */
  proTableProps: ProTableProps<T, ParamsType>;
  /** 下载模版的方法 */
  onDownloadTemplate: () => void;
  /** 导入文件的方法 */
  onImportFile: (
    fileListParams: FileType,
    successCallBack: () => void,
    failCallBack: () => void,
  ) => void;
  /** 文件格式 */
  acceptValue?: string;
  /** 文件类型 */
  fileTypeValue?: string[];
  /** 文件类型展示文案 */
  fileTypeText?: string;
  /** 是否查看 */
  isView?: boolean;
  /** 传入的 tableRef */
  tableRef?: React.MutableRefObject<ActionType | null>;
  /** 是否隐藏表格 */
  hiddenTable?: boolean;
}

const ImportFile = <T extends object = any, ParamsType extends object = any>({
  tableRef,
  isView = false,
  acceptValue,
  fileTypeValue,
  fileTypeText,
  templateTipsText,
  maxSize,
  columns,
  extraParams,
  proTableProps,
  onDownloadTemplate,
  onImportFile,
  hiddenTable = false,
}: ImportFileProps<T, ParamsType>) => {
  const localTableRef = useRef<ActionType>(null);
  // 使用传入的 tableRef，如果没有则创建新的
  const usedTableRef = tableRef || localTableRef;

  /** 上传的文件列表 */
  const [fileParams, setFileParams] = useState<FileType>();

  /** 上传文件的loading */
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);

  /** 导入文件的loading */
  const [importBtnLoading, setImportBtnLoading] = useState(false);

  const [downloadBtnLoading, setDownloadBtnLoading] = useState(false);

  // 节流处理 onDownloadTemplate
  const throttledDownloadTemplate = throttle(async () => {
    setDownloadBtnLoading(true); // 开始下载时禁用按钮
    try {
      await onDownloadTemplate();
    } catch (error) {
      Toast('error', I18N.components.downloadTemplateLost);
    } finally {
      setDownloadBtnLoading(false); // 下载完成后启用按钮
    }
  }, 2000); // 1 秒内只能执行一次

  /** 文件上传 */
  const changeFileFn = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
      const { url } = info.file.response.data;
      const suffixArr = info.file.name.split('.');
      const data = {
        suffix: suffixArr[suffixArr.length - 1],
        url,
        uid: info.file.uid,
        name: info.file.name,
      };
      setFileParams(data);
      setUploadBtnLoading(false);
    }
  };

  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: false,
    accept: acceptValue || '.xls, .xlsx, .XLS, .XLSX',
    name: 'file',
    onChange: changeFileFn,
    action: `${baseUrl}${UPLOAD_FILES_URL_SALE}`,
    headers: {
      Authorization: `${getToken()}`,
    },
    beforeUpload: file => {
      const { name } = file;
      const typeFile = name.split('.');
      const fileType = fileTypeValue || ['xls', 'xlsx', 'XLS', 'XLSX'];
      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast(
          'error',
          I18N.template(I18N.components.onlySupportsFi, {
            val1: fileType.join(','),
          }),
        );
        return false;
      }
      if (file.size > maxSize * 1024 * 1024) {
        Toast(
          'error',
          I18N.template(I18N.components.theFileCannotExceed, { val1: maxSize }),
        );
        return Upload.LIST_IGNORE;
      }
      setUploadBtnLoading(true);
      return true;
    },
  };

  return (
    <div className={style.importFilewrapper}>
      {!isView && (
        <div className={style.header}>
          <Row gutter={[12, 0]}>
            <Col span={12}>
              <div className={style.section}>
                {/* 第一步的提示文案 */}
                <p className={style.fileTips}>1、{templateTipsText}</p>
                <Button
                  onClick={throttledDownloadTemplate}
                  loading={downloadBtnLoading}
                >
                  {I18N.components.downloadTemplate}
                </Button>
              </div>
            </Col>

            <Col span={12}>
              <div className={style.section}>
                <p className={style.fileTips}>
                  {I18N.components.uploadFileSupport}
                  {fileTypeText || 'xls、xlsx'}
                  {I18N.components.singleFileMost}
                  {maxSize}M
                </p>
                {fileParams ? (
                  <div className={style.fileListBack}>
                    <div className={style.fileListBackFile}>
                      <IconFont
                        className={style.fileIcon}
                        icon='icon-icon-Excel'
                      />
                      <Text
                        className={style.fileName}
                        ellipsis={{ tooltip: false }}
                      >
                        {fileParams.name}
                      </Text>
                    </div>
                    <div className={style.uploadWrapper}>
                      <Upload className={style.upload} {...fileProps}>
                        <Button loading={uploadBtnLoading}>
                          {I18N.carbonFootPrint.reUpload}
                        </Button>
                      </Upload>
                      <Button
                        loading={importBtnLoading}
                        onClick={async () => {
                          setImportBtnLoading(true);
                          onImportFile(
                            fileParams,
                            () => {
                              setImportBtnLoading(false);
                              setFileParams(undefined);
                              usedTableRef.current?.reload();
                            },
                            () => {
                              setImportBtnLoading(false);
                            },
                          );
                        }}
                        type='primary'
                      >
                        {I18N.carbonFootPrint.import}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Upload {...fileProps}>
                    <Button loading={uploadBtnLoading}>
                      {I18N.carbonFootPrint.uploadFiles}
                    </Button>
                  </Upload>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
      {!hiddenTable && (
        <div className={style.tableWrapper}>
          <div className={style.tabelHeader}>
            <h4 className={style.tableTitle}>
              {I18N.carbonFootPrint.importHistory}
            </h4>
            {!isView && (
              <Button
                type='primary'
                onClick={() => usedTableRef.current?.reload()}
              >
                {I18N.components.refresh}
              </Button>
            )}
          </div>
          <ProTable
            scroll={{ x: 1600 }}
            {...proTableProps}
            size='small'
            columns={columns}
            actionRef={tableRef}
            pagination={{
              defaultPageSize: 10,
              size: 'small',
              showTotal: undefined,
              showSizeChanger: true,
            }}
            search={false}
            params={{
              ...extraParams,
            }}
            columnsState={{
              persistenceKey: 'ImportFile',
              persistenceType: 'localStorage',
            }}
            toolBarRender={false}
          />
        </div>
      )}
    </div>
  );
};
export default ImportFile;
