/**
 * @description formily 文件上传
 */
import { CloudUploadOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import { useField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, Spin, Typography, Upload } from 'antd';
import { UploadFile, UploadProps } from 'antd/lib/upload';
import classNames from 'classnames';
import { cloneDeep, isArray } from 'lodash-es';
import { useEffect, useState } from 'react';

import { baseUrl } from '@/api/request';
import { IconFont } from '@/components/IconFont';
import { Toast, getSuffix } from '@/utils';
import { UPLOAD_FILES_URL_SALE } from '@/utils/const';
import { getToken } from '@/utils/cookie';

import style from './index.module.less';
import { FileListType } from './type';
import { commonRequestDownloadFile } from '@/utils/downBlobFile';

const { Text } = Typography;

// const fileType =
//   '.png,.PNG,.jpg,.JPG,.JPEG,.jpeg,.xls,.xlsx,.XLS,.XLSX,.doc,.DOC,.docx,.DOCX,.pdf,.PDF,.rar,.RAR,.zip,.ZIP';

// const maxCount = 10;

let isPassBeforeUploadLimit = true;

export const FormilyFileUpload = ({
  value,
  onChange,
  maxCount = 10,
  fileType = '.png,.PNG,.jpg,.JPG,.JPEG,.jpeg,.xls,.xlsx,.XLS,.XLSX,.doc,.DOC,.docx,.DOCX,.pdf,.PDF,.rar,.RAR,.zip,.ZIP,.msg,.MSG',
  formatText = I18N.components.formatSupportD,
  sizeLimit = 20,
  sizeLimitText = I18N.components.allFilesAreTheMost,
}: {
  value: FileListType[];
  showUploadButton?: boolean;
  /** 最大上传数量 */
  maxCount?: number;
  /** 上传文件类型 */
  fileType?: string;
  /** 上传文件的提示语 */
  formatText?: string;
  /** 单个文件大小限制（单位MB） */
  sizeLimit?: number;
  /** 文件大小限制提示文案 */
  sizeLimitText?: string;
  onChange: (value: FileListType[]) => void;
}) => {
  const field = useField<Field>();
  const isReadPretty = field.readPretty || field.disabled;

  /** 文件列表 */
  const [fileListBack, setFileListBack] = useState<FileListType[]>([]);

  useEffect(() => {
    // 设置文件
    if (value && value.length > 0 && isArray(value)) {
      const arr = value.map(item => {
        const { uid, name, url } = item;
        return {
          uid,
          name,
          url,
        };
      });
      setFileListBack([...arr]);
    } else {
      setFileListBack([]);
    }
  }, [value]);

  /** 文件上传的方法 */
  const onImgChange: UploadProps['onChange'] = ({ fileList }) => {
    if (!isPassBeforeUploadLimit) {
      return;
    }
    const newArr = fileList
      .filter(item => {
        // 过滤掉上传失败的文件，只保留上传中和上传成功的文件
        // 1. 过滤掉 status 为 error 的文件
        if (item.status === 'error') {
          return false;
        }
        // 2. 如果是 done 状态，需要检查接口返回的 code 是否为 200
        if (item.status === 'done' && item.response?.code !== 200) {
          Toast('error', item.response?.msg);
          return false;
        }
        // 3. 保留 uploading 和上传成功的文件
        return true;
      })
      .map(item => {
        const { response, name, uid } = item;
        if (item.status === 'done' && response?.code === 200) {
          return {
            url: response.data.url,
            name,
            uid,
          };
        }
        return {
          ...item,
        };
      });
    setFileListBack([...newArr]);
    if (
      newArr.every(item => item?.url?.length > 0) &&
      typeof onChange === 'function'
    ) {
      onChange([...newArr]);
    }
  };

  /** 删除文件 */
  const onRemove: UploadProps['onRemove'] = file => {
    const oldFile = cloneDeep(fileListBack).filter(res => res.uid !== file.uid);
    setFileListBack(oldFile);
    if (typeof onChange === 'function') {
      onChange(oldFile);
    }
  };

  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: true,
    disabled: isReadPretty,
    accept: fileType,
    name: 'file',
    maxCount,
    action: `${baseUrl}${UPLOAD_FILES_URL_SALE}`,
    headers: {
      Authorization: getToken(),
    },
    onChange: onImgChange,
    onRemove,
    beforeUpload: file => {
      const typeFile = file.name.split('.');

      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast(
          'error',
          I18N.template(I18N.components.fileTypeFormat, { val1: fileType }),
        );
        isPassBeforeUploadLimit = false;
        return false;
      }

      if (fileListBack.length >= maxCount) {
        Toast(
          'error',
          I18N.template(I18N.components.maxNumberOfFiles, { val1: maxCount }),
        );
        return false;
      }

      if (file.size > sizeLimit * 1024 * 1024) {
        Toast(
          'error',
          I18N.template(I18N.components.theFileSizeIsIncorrect, {
            val1: sizeLimit,
          }),
        );
        return Upload.LIST_IGNORE;
      }

      isPassBeforeUploadLimit = true;
      return true;
    },
  };

  return (
    <div className={style.fileUploadWrapper}>
      {!isReadPretty && (
        <div className={style.tips}>
          {/* 格式支持doc, docx, XLS, XLSX, PDF, zip, rar, PNG, JPG,
          jpeg，允许上传多个文件，所有文件最多不超过20MB */}
          {I18N.template(I18N.components.forma, {
            val1: formatText,
            val2: sizeLimitText,
          })}
        </div>
      )}
      <Upload
        {...fileProps}
        fileList={[...fileListBack] as UploadFile[]}
        // eslint-disable-next-line react/no-unstable-nested-components
        itemRender={(_, file, __, actions) => {
          const loading = file.status === 'uploading';
          const nameArr = file?.name?.split('.');
          const suffix = nameArr?.[nameArr.length - 1];
          const name = file?.name?.slice(0, file.name.length - suffix.length);
          const fileItem = {
            ...file,
            suffix,
          };
          return (
            <div
              className={classNames(style.fileWrapper, {
                [style.readPrettyWrapper]: isReadPretty,
              })}
            >
              <div
                className={style.fileContent}
                onClick={() => {
                  commonRequestDownloadFile(
                    fileItem?.url || '',
                    fileItem?.name,
                    false,
                  );
                }}
              >
                <Spin size='small' spinning={loading}>
                  {/* <a href={fileItem.url} target='_blank' rel='noreferrer'> */}
                  <IconFont
                    className={style.fileIcon}
                    icon={getSuffix(fileItem.suffix)}
                  />
                  <Text
                    className={style.name}
                    ellipsis={{ suffix: fileItem.suffix }}
                  >
                    {name}
                  </Text>
                  {/* </a> */}
                </Spin>
              </div>
              {!isReadPretty && (
                <div
                  className={style.delBtn}
                  onClick={() => {
                    actions?.remove();
                  }}
                >
                  <IconFont
                    className={style.delIcon}
                    icon='icon-icon-shanchu'
                  />
                </div>
              )}
            </div>
          );
        }}
      >
        <Button disabled={isReadPretty} icon={<CloudUploadOutlined />}>
          {I18N.carbonFootPrint.uploadFiles}
        </Button>
      </Upload>
    </div>
  );
};
