/*
 * @@description: 图片上传
 */
import { CloudUploadOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import { Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import classNames from 'classnames';
import { FC, memo } from 'react';

import { baseUrl } from '@/api/request';
import { Toast } from '@/utils';
import { UPLOAD_FILES_RANDOM_NAME_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { FileListType } from '@/views/components/utils/types';

import style from './index.module.less';

export type Props = {
  maxCount: number;
  maxSize: number;
  fileType: string[];
  fileList: FileListType[];
  errorSizeTips?: string;
  changeImageChange?: (info: UploadChangeParam<UploadFile<any>>) => void;
};

export const PictureUpload: FC<Props & UploadProps> = memo(
  ({
    maxCount,
    maxSize,
    fileType,
    fileList,
    disabled,
    errorSizeTips,
    changeImageChange,
    ...props
  }) => {
    /** 上传图片的参数 */
    const fileProps: UploadProps = {
      ...props,
      listType: 'picture-card',
      name: 'file',
      maxCount,
      fileList,
      action: `${baseUrl}${UPLOAD_FILES_RANDOM_NAME_URL}`,
      headers: {
        Authorization: getToken(),
      },
      disabled,
      showUploadList: { showRemoveIcon: !disabled, showPreviewIcon: true },
      onChange: changeImageChange,
      beforeUpload: file => {
        const { name } = file;
        const typeFile = name.split('.');
        if (!fileType.includes(typeFile[typeFile.length - 1])) {
          Toast(
            'error',
            I18N.template(I18N.carbonFootPrint.onlySupportsFi2, {
              val1: fileType.join(','),
            }),
          );
          return false;
        }
        if (fileList.length >= maxCount) {
          Toast(
            'error',
            I18N.template(I18N.carbonFootPrint.maximumNumberOfFiles, {
              val1: maxCount,
            }),
          );
          return false;
        }
        if (file.size > maxSize) {
          Toast('error', errorSizeTips || I18N.carbonAccount.theFileIsTooLarge);
          return Upload.LIST_IGNORE;
        }
        return true;
      },
    };
    return (
      <div className={style.cardUploadWrapper}>
        <div
          className={classNames(style.uploadCardSelectBtnWrapper, {
            [style.disabledCardListItem]: fileList.length >= 5,
          })}
        >
          <Upload {...fileProps}>
            {!disabled && (
              <div>
                <p>
                  <CloudUploadOutlined className={style.uploadIcon} />
                </p>
                <p className={style.uploadText}>{I18N.eca.uploadImages}</p>
              </div>
            )}
          </Upload>
        </div>
      </div>
    );
  },
);
