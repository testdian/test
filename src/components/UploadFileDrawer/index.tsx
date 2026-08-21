/**
 * @description 上传附件抽屉
 */
import {
  DeleteOutlined,
  InboxOutlined,
  LoadingOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Button, Upload, UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import saveAs from 'file-saver';
import React, { useEffect, useState } from 'react';

import { baseUrl } from '@/api/request';
import CustomDrawer from '@/components/CustomDrawer';
import I18N from '@/lang/I18N';
import { Toast } from '@/utils';
import { UPLOAD_FILES_URL_SALE } from '@/utils/const';
import { getToken } from '@/utils/cookie';

import style from './index.module.less';

interface UploadFileInfo {
  name: string;
  url: string;
}

interface UploadFileDrawerProps {
  /** 外层传入的已上传文件列表 */
  filesList: UploadFile[];
  isReadPretty?: boolean;
  sizeLimit?: number;
  visible: boolean;
  onClose: () => void;
  onSave: (files: UploadFileInfo[]) => void;
  tipText?: string;
  title?: string;
  maxCount?: number;
}

const fileType =
  '.png,.PNG,.jpg,.JPG,.JPEG,.jpeg,.xls,.xlsx,.XLS,.XLSX,.doc,.DOC,.docx,.DOCX,.pdf,.PDF,.rar,.RAR,.zip,.ZIP';

let isPassBeforeUploadLimit = true;

const UploadFileDrawer: React.FC<UploadFileDrawerProps> = ({
  title = '上传附件',
  tipText = '支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar、msg格式文件，单个文件不超过50M，总共不超过250M，最多上传不超过5个文件',
  filesList,
  sizeLimit = 50,
  maxCount,
  visible,
  onClose,
  onSave,
}) => {
  const [allUploadedFiles, setAllUploadedFiles] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (maxCount !== undefined && allUploadedFiles?.length >= maxCount) {
      Toast('error', `最多支持上传${maxCount}个附件`);
      return;
    }

    if (!isPassBeforeUploadLimit) {
      return;
    }
    const { fileList: changeFilesList, file } = info;
    setFileList(changeFilesList);

    // 后续逻辑保持与文件状态同步
    if (changeFilesList.every(({ status }) => status === 'done')) {
      setFileList([]);
      setAllUploadedFiles(prev => [
        ...prev,
        ...changeFilesList.map(file => ({
          ...file,
          url: file.response?.data?.url,
        })),
      ]);
    }

    // 处理上传失败的文件
    if (file.status === 'error') {
      Toast('error', I18N.eca.fileUploadLost);
    }
  };

  // 点击保存按钮时，整理文件信息并传递出去
  const handleSave = () => {
    // 过滤出已上传成功的文件
    const uploadedFiles = allUploadedFiles
      .filter(file => file.url)
      .map(file => ({
        name: file.name,
        url: file.url || '',
        uid: file.uid,
      }));
    onSave(uploadedFiles);
  };

  const handleFileDelete = (uid: string) => {
    setAllUploadedFiles(prev => prev.filter(f => f.uid !== uid));
  };

  const props = {
    name: 'file',
    multiple: true,
    accept: fileType,
    action: `${baseUrl}${UPLOAD_FILES_URL_SALE}`,
    headers: {
      Authorization: `${getToken()}`,
    },
    beforeUpload: (file: { name: string; size: number }) => {
      // 修复：使用正则表达式匹配最后一个点后的扩展名
      const extMatch = file.name.match(/\.([^.]+)$/);
      const fileExt = extMatch ? extMatch[1] : '';

      // 修复：使用标准化的格式检查扩展名
      const allowedExtensions = fileType
        .split(',')
        .map(ext => ext.toLowerCase());
      if (!allowedExtensions.includes(`.${fileExt.toLowerCase()}`)) {
        Toast(
          'error',
          I18N.template(I18N.components.fileTypeFormat, { val1: fileType }),
        );
        isPassBeforeUploadLimit = false;
        return false;
      }

      if (file.size > sizeLimit * 1024 * 1024) {
        Toast(
          'error',
          I18N.template(I18N.eca.theFileSizeIsIncorrect, { val1: sizeLimit }),
        );
        return false;
      }

      isPassBeforeUploadLimit = true;
      return true;
    },
    onChange: handleChange,
  };

  useEffect(() => {
    if (!visible) {
      setFileList([]);
      setAllUploadedFiles([]);
      isPassBeforeUploadLimit = true;
    } else {
      setAllUploadedFiles(prev => [...prev, ...filesList]);
    }
  }, [visible, filesList]);

  return (
    <CustomDrawer
      title={title}
      width={500}
      onClose={onClose}
      visible={visible}
      destroyOnClose
      footer={[
        <Button key='cancel' onClick={onClose}>
          {I18N.Factors.cancel}
        </Button>,
        <Button key='save' type='primary' onClick={handleSave}>
          {I18N.Factors.preserve}
        </Button>,
      ]}
    >
      <div>
        <Upload.Dragger
          {...props}
          showUploadList={false}
          fileList={fileList}
          listType='text' // 使用文本列表类型
        >
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>{I18N.eca.dragAndDropTheFile}</p>
          <p className='ant-upload-hint'>{tipText}</p>
        </Upload.Dragger>

        {/* 正在上传的列表 */}
        <div className={style.uploadingContent}>
          <div className={style.uploadTip}>
            {I18N.eca.uploading}
            {fileList.length}）
          </div>
          {fileList.map(file => {
            const { uid: id, name, percent } = file;
            return (
              <div className={style.fileItem} key={id}>
                <div>
                  <span>{name}</span>
                </div>
                <div className={style.fileItemPercentRight}>
                  <div className={style.percent}>
                    <LoadingOutlined className={style.percentLoading} />
                    <span>{Math.ceil(Number(percent))}%</span>
                  </div>
                  {/* 删除 */}
                  <div
                    className={style.fileOperate}
                    onClick={() => {
                      /** 使用 uid  删除文件 */
                      setFileList(prev => {
                        return prev.filter(item => item.uid !== id);
                      });
                    }}
                  >
                    <DeleteOutlined className={style.fileOperateBtn} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 已上传列表展示区域 */}
        <div className={style.uploadTip}>
          {I18N.eca.fileUploaded}
          {allUploadedFiles.length}）
        </div>
        <div className={style.uploadingContent}>
          {allUploadedFiles.map(file => {
            const { uid, name, url } = file;
            return (
              <div className={style.fileItem} key={uid}>
                <div className={style.fileItemLeft}>
                  <div className={style.fileName} title={name}>
                    {name}
                  </div>
                </div>
                <div className={style.fileOperate}>
                  {/* 下载 */}
                  <div
                    className={style.fileOperateBtn}
                    onClick={() => {
                      saveAs(url as string, name);
                    }}
                  >
                    <VerticalAlignBottomOutlined />
                  </div>
                  {/* 删除 */}
                  <div
                    className={style.fileOperateBtn}
                    onClick={() => handleFileDelete(uid)}
                  >
                    <DeleteOutlined />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CustomDrawer>
  );
};

export default UploadFileDrawer;
