/*
 * @@description: 导入
 */
import I18N from '@src/lang/I18N';
import { Button, Col, Row, Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { baseUrl } from '@/api/request';
import { FormActions } from '@/components/FormActions';
import { IconFont } from '@/components/IconFont';
import { usePageInfo } from '@/hooks';
import { Toast, getImportReturnUrl } from '@/utils';
import { UPLOAD_FILES_RANDOM_NAME_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { FileListType, FileType } from '@/views/components/utils/types';

import style from './index.module.less';
import { downloadFile } from './utils';

function Import({
  importType,
  importTypeName,
  masterplateFile,
  importBtnLoading,
  importFlag,
  children,
  importFile,
}: {
  /** 导入类型 */
  importType: '1' | '2' | '4';
  /** 导入类型名称 */
  importTypeName: string;
  /** 模板文件 {name: 模板文件名称，url：模板文件地址} */
  masterplateFile: FileType;
  /** 导入文件的loading */
  importBtnLoading: boolean;
  /** 导入标识 */
  importFlag: boolean;
  /** 子节点 */
  children: ReactNode;
  /** 导入的方法 */
  importFile?: (record: FileType) => void;
}) {
  const navigate = useNavigate();

  /** 模型ID */
  const { modelId } = usePageInfo();

  /** 上传的文件列表 */
  const [fileListParams, setFileListParams] = useState<FileListType>();

  /** 上传文件的loading */
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    setFileListParams(undefined);
  }, [importFlag]);

  /** 文件上传 */
  const changeFileFn = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
      const { url } = info.file.response.data;
      const suffixArr = info.file.name.split('.');
      const nameArr = url.split('dct/');
      const data = {
        suffix: suffixArr[suffixArr.length - 1],
        name: nameArr[1],
        url,
        fileName: info.file.name,
      };
      setFileListParams(data as FileListType);
      setBtnLoading(false);
    }
  };

  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: false,
    accept: '.xlsx,.XLSX',
    name: 'file',
    onChange: changeFileFn,
    action: `${baseUrl}${UPLOAD_FILES_RANDOM_NAME_URL}`,
    headers: {
      Authorization: getToken(),
    },
    beforeUpload: file => {
      const { name } = file;
      const typeFile = name.split('.');
      const fileType = ['xlsx', 'XLSX'];
      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast(
          'error',
          I18N.template(I18N.supplyChainCarbonManagement.onlySupportsFi, {
            val1: fileType.join(','),
          }),
        );
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        Toast('error', I18N.carbonFootPrint.theFileIsTooLarge);
        return Upload.LIST_IGNORE;
      }
      setBtnLoading(true);
      return true;
    },
  };

  return (
    <div className={style.importFilewrapper}>
      <div>
        <h4>
          {I18N.carbonFootPrint.import}
          {importTypeName}
        </h4>
        <div className={style.header}>
          <Row justify='space-around' gutter={24}>
            <Col className={style.section} span={12}>
              <p className={style.fileTips}>
                {I18N.carbonAccount.download}
                {importTypeName}
                {I18N.carbonAccount.importTemplateRoot}
                {importTypeName}
                {I18N.supplyChainCarbonManagement.information}
              </p>
              <Button
                onClick={() => {
                  downloadFile(masterplateFile.url, masterplateFile.name);
                }}
              >
                {I18N.carbonFootPrint.downloadTemplate}
              </Button>
            </Col>
            <Col className={style.section} span={11}>
              <p className={style.fileTips}>
                {I18N.carbonFootPrint.uploadFileSupport}
              </p>
              {fileListParams ? (
                <div className={style.fileListBack}>
                  <div className={style.fileListBackFile}>
                    <IconFont
                      className={style.fileIcon}
                      icon='icon-icon-Excel'
                    />
                    <span>{fileListParams.fileName}</span>
                  </div>
                  <div className={style.uploadWrapper}>
                    <Upload className={style.upload} {...fileProps}>
                      <Button loading={btnLoading}>
                        {I18N.carbonFootPrint.reUpload}
                      </Button>
                    </Upload>
                    <Button
                      loading={importBtnLoading}
                      onClick={() => {
                        importFile?.(fileListParams);
                      }}
                      type='primary'
                    >
                      {I18N.carbonFootPrint.import}
                    </Button>
                  </div>
                </div>
              ) : (
                <Upload {...fileProps}>
                  <Button loading={btnLoading}>
                    {I18N.carbonFootPrint.uploadFiles}
                  </Button>
                </Upload>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <h4>{I18N.carbonFootPrint.importHistory}</h4>
        {children && <div>{children}</div>}
      </div>
      <FormActions
        place='center'
        buttons={[
          {
            title: I18N.Factors.return,
            onClick: async () => {
              const lcaModelEditUrl = getImportReturnUrl(importType);
              navigate({
                pathname: lcaModelEditUrl,
                search: `id=${modelId}&currentStep=1`,
              });
            },
          },
        ]}
      />
    </div>
  );
}
export default Import;
