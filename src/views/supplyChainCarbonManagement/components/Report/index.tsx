/*
 * @@description: 文件上传
 */
import { CloudUploadOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Button, Upload, UploadProps, Tooltip } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

import { baseUrl } from '@/api/request';
import { IconFont } from '@/components/IconFont';
import { Toast } from '@/utils';
import { UPLOAD_FILES_RANDOM_NAME_URL_SALE } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { FileListType } from '@/views/components/utils/types';

import style from './index.module.less';
import { getSuffix } from './utils';

function Report({
  fileList,
  fileType,
  maxCount,
  maxSize,
  errorTip,
  disabled,
  changeFileChange,
  removeList,
}: {
  /** 文件列表 */
  fileList: FileListType[];
  /** 允许上传的文件类型 */
  fileType: string;
  /** 允许上传文件的最大数量 */
  maxCount: number;
  /** 允许文件上传的最大值 */
  maxSize: number;
  /** 上传错误提示 */
  errorTip: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 文件上传方法 */
  changeFileChange?: (info: UploadChangeParam<UploadFile<any>>) => void;
  /** 文件删除方法 */
  removeList?: (item: FileListType) => void;
}) {
  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: false,
    disabled,
    accept: fileType,
    name: 'file',
    maxCount: 10,
    action: `${baseUrl}${UPLOAD_FILES_RANDOM_NAME_URL_SALE}`,
    headers: {
      Authorization: getToken(),
    },
    onChange: changeFileChange,
    beforeUpload: file => {
      const { name } = file;
      const typeFile = name.split('.');

      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast(
          'error',
          I18N.template(I18N.supplyChainCarbonManagement.onlySupportsFi2, {
            val1: fileType,
          }),
        );
        return false;
      }
      if (fileList.length >= maxCount) {
        Toast(
          'error',
          I18N.template(I18N.supplyChainCarbonManagement.maximumNumberOfFiles, {
            val1: maxCount,
          }),
        );
        return false;
      }
      if (file.size > maxSize) {
        Toast('error', errorTip);
        return Upload.LIST_IGNORE;
      }
      return true;
    },
  };
  return (
    <div className={style.uploadWrapper}>
      <Upload {...fileProps}>
        {!disabled && (
          <Button className={style.uploadBtn} icon={<CloudUploadOutlined />}>
            {I18N.carbonFootPrint.uploadFiles}
          </Button>
        )}
      </Upload>
      <div className={style.fileListWrapper}>
        {fileList &&
          fileList.length > 0 &&
          fileList.map((item, index) => {
            return (
              <div
                className={style.fileListItemWrapper}
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.url}-${index}`}
              >
                <div
                  className={style.fileContent}
                  onClick={() => {
                    window.open(item.url, '_blank');
                  }}
                >
                  <IconFont
                    className={style.icon}
                    icon={getSuffix(item.suffix)}
                  />
                  <Tooltip placement='topLeft' title={item.name}>
                    <span>{item.name}</span>
                  </Tooltip>
                </div>
                {!disabled && (
                  <div
                    className={style.delBtn}
                    onClick={() => {
                      removeList?.(item);
                    }}
                  >
                    <IconFont className={style.icon} icon='icon-icon-shanchu' />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default Report;
