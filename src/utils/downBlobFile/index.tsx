import { Modal, Image } from 'antd';
import { AxiosResponse } from 'axios';
import { throttle } from 'lodash-es';

import { downloadBlobFileApi } from '@/api/file';
import { currentMode } from '@/config';
import I18N from '@/lang/I18N';

import { Toast } from '..';

// 下载文件方法
const downloadBlob = (blobUrl: string, fileNameValue: string) => {
  // 原有的下载逻辑
  const link = document.createElement('a'); // 创建a标签
  link.href = blobUrl; // 设置a标签的href为创建的URL
  link.setAttribute('download', `${fileNameValue}`); // 设置a标签的download属性为文件名值或解析的文件名
  document.body.appendChild(link); // 将a标签添加到文档中
  link.click(); // 模拟点击a标签进行文件下载
  document.body.removeChild(link); // 移除a标签
  // 在适当的时机调用这个函数以释放创建的URL
  URL.revokeObjectURL(blobUrl); // 撤销对象URL，释放资源
};

// 预览文件方法
const previewFile = (url: string, contentType: string) => {
  let urlValue;
  let isImage = false;
  let isPdf = false;
  // 检查环境并处理响应
  if (['development', 'test'].includes(currentMode)) {
    // 在开发和测试环境中
    urlValue = url;
    // 根据URL扩展名检查文件类型
    isImage = urlValue.match(/\.(jpeg|jpg|gif|png|svg)$/i) != null;
    isPdf = urlValue.match(/\.pdf$/i) != null;
  } else {
    // 在生产环境中，处理文件流
    urlValue = url;
    // 根据contentType检查文件类型
    isImage = contentType?.includes('image/');
    isPdf = contentType?.includes('application/pdf');
  }

  if (isImage) {
    // 如果是图片，使用<img>标签显示
    Modal.info({
      width: '50%',
      icon: false,
      title: '预览',
      okText: '关闭预览',
      maskClosable: true,
      closable: true,
      footer: null,
      content: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image src={urlValue} width='90%' alt='Image Preview' />,
        </div>
      ),
    });
  } else if (isPdf) {
    // 如果是PDF，使用<iframe>显示
    Modal.info({
      width: '80%',
      title: '预览',
      okText: '关闭预览',
      maskClosable: true,
      content: (
        <iframe
          src={urlValue}
          style={{ width: '100%', height: '60vh', border: 'none' }}
          title='PDF Preview'
        />
      ),
    });
  }
};

/**
 * 下载文件
 * @param response 响应对象，假设为Blob类型
 * @param res AxiosResponse对象
 * @param fileNameValue 文件名值（可选）
 * @param preview 是否预览文件，默认为false
 */
export const downloadBlobFile = (
  response: unknown | Blob, // 假设response是一个Blob对象
  res: AxiosResponse,
  fileNameValue?: string,
  preview = false, // 控制是否预览文件
  // dev和测试环境文件是url字段
  devOrTestUrl?: string,
) => {
  try {
    const disposition = res.headers['content-disposition']; // 获取响应头中的content-disposition
    const contentType = res.headers['content-type'];
    const fileName = decodeURI(disposition?.split('filename=')?.[1] || ''); // 解码文件名并获取文件名
    // 当前环境变量
    const isCurrentDevOrTestMode = ['development', 'dev', 'test'].includes(
      currentMode,
    );
    // 创建对象URL，将响应数据转为Blob并创建URL
    const url = URL.createObjectURL(response as Blob);
    // 如果是开发、测试环境 对devOrTestUrl进行处理
    if (isCurrentDevOrTestMode) {
      const isImage = devOrTestUrl?.match(/\.(jpeg|jpg|png|gif)$/i) != null;
      const isPdf = devOrTestUrl?.match(/\.pdf$/i) != null;
      if (preview && (isImage || isPdf)) {
        previewFile(devOrTestUrl || '', '');
      } else {
        downloadBlob(url, fileNameValue || fileName);
      }
    } else if (
      preview &&
      (contentType?.includes('image/') ||
        contentType?.includes('application/pdf'))
    ) {
      // 预览
      previewFile(url, `${contentType}`);
    } else {
      // 执行下载逻辑
      downloadBlob(url, fileNameValue || fileName);
    }
  } catch (error) {
    Toast('error', '文件处理失败');
  }
};

/** 解析Content-Disposition字段以获取文件名 */
export const downloadTemplateBlobFile = (
  response: unknown,
  res: AxiosResponse,
  fileNameValue?: string,
) => {
  try {
    const disposition = res.headers['content-disposition'];
    const fileName = decodeURI(disposition?.split('filename=')?.[1] || '');
    if (!fileName) {
      Toast('warning', I18N.carbonData.noDataAvailableForExport);
      return;
    }
    const url = URL.createObjectURL(response as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileNameValue || fileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    Toast('error', I18N.carbonData.fileDownloadLoss);
  }
};

// 使用 lodash 的 throttle 函数创建节流版本的 API 请求
// 1000ms 内只执行一次请求，且在延迟开始前执行
export const throttleDownloadBlobFileApi = throttle(downloadBlobFileApi, 3000, {
  leading: true, // 允许在节流开始时立即执行
  trailing: false, // 不允许在节流结束后执行
});

export const commonRequestDownloadFile = async (
  url: string,
  fileName?: string,
  preview = false,
) => {
  const response = await throttleDownloadBlobFileApi({
    file: url,
    fileName,
  });

  downloadBlobFile(response?.data, response, fileName, preview, url);
};

/**
 * 从URL中提取文件名（包括扩展名）
 * @param {string} url - 包含文件名的URL
 * @returns {string} - 提取的文件名，如果未找到则返回空字符串
 */
export const extractFileNameFromUrl = (url: string) => {
  if (!url || typeof url !== 'string') return '';

  // 常见文件扩展名列表
  const extensions = [
    'png',
    'PNG',
    'jpg',
    'JPG',
    'JPEG',
    'jpeg',
    'xls',
    'xlsx',
    'XLS',
    'XLSX',
    'doc',
    'DOC',
    'docx',
    'DOCX',
    'pdf',
    'PDF',
    'rar',
    'RAR',
    'zip',
    'ZIP',
  ];

  // 构建正则表达式模式
  const pattern = `\\.(${extensions.join('|')})$`;
  const regex = new RegExp(pattern);

  // 从URL中提取可能的文件名
  const { pathname } = new URL(url);
  const segments = pathname.split('/');
  const potentialFileName = segments.pop() || '';

  // 验证是否包含有效扩展名
  if (regex.test(potentialFileName)) {
    return potentialFileName;
  }

  return '';
};
