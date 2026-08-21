// import { InboxOutlined } from '@ant-design/icons';
// import type { UploadFile, UploadProps } from 'antd';
// import { Spin, Typography, Upload } from 'antd';
// import { UploadChangeParam } from 'antd/es/upload';
// import { FC, useState } from 'react';

// import { baseUrl } from '@/api/request';
// import { Toast } from '@/utils';
// import { UPLOAD_FILES_URL } from '@/utils/const';
// import { getToken } from '@/utils/cookie';

// import style from './index.module.less';

// const { Text } = Typography;

// const { Dragger } = Upload;

// const maxSize = 50;

// export type FileType = {
//   name: string;
//   uid: string;
//   url: string;
//   suffix: string;
// };
// /** 支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件，最大 50 MB */
// const fileType =
//   '.png,.PNG,.jpg,.JPG,.JPEG,.jpeg,.xls,.xlsx,.XLS,.XLSX,.doc,.DOC,.docx,.DOCX,.pdf,.PDF,.rar,.RAR,.zip,.ZIP';

// const DraggerFile: FC = () => {
//   /** 上传的文件列表 */
//   const [fileParams, setFileParams] = useState<UploadFile[]>([]);

//   /** 文件上传 */
//   const changeFileFn = (info: UploadChangeParam<UploadFile<any>>) => {
//     if (info.file.status === 'done') {
//       const { url } = info.file.response.data;
//       const suffixArr = info.file.name.split('.');
//       const data = {
//         suffix: suffixArr[suffixArr.length - 1],
//         url,
//         uid: info.file.uid,
//         name: info.file.name,
//       };
//       setFileParams(prev => [...prev, data]);
//     }
//   };

//   const props: UploadProps = {
//     showUploadList: false,
//     accept: fileType,
//     name: 'file',
//     onChange: changeFileFn,
//     action: `${baseUrl}${UPLOAD_FILES_URL}`,
//     headers: {
//       Authorization: `${getToken()}`,
//     },
//     beforeUpload: file => {
//       const { name } = file;
//       // 修复：使用正则表达式匹配最后一个点后的扩展名
//       const extMatch = name.match(/\.([^.]+)$/);
//       const fileExt = extMatch ? extMatch[1] : '';

//       // 修复：使用标准化的格式检查扩展名
//       const allowedExtensions = fileType
//         .split(',')
//         .map(ext => ext.toLowerCase());
//       if (!allowedExtensions.includes(`.${fileExt.toLowerCase()}`)) {
//         Toast('error', `只支持${fileType.replace(/\./g, '')}格式文件上传`);
//         return false;
//       }

//       if (file.size > maxSize * 1024 * 1024) {
//         Toast('error', `文件不可超过${maxSize}M`);
//         return Upload.LIST_IGNORE;
//       }

//       return true;
//     },
//     onDrop(e) {
//       console.log('Dropped files', e.dataTransfer.files);
//     },
//   };

//   const itemRender = (_, file, __, actions) => {
//     console.log('itemRender', file);
//     const loading = file.status === 'uploading';
//     const nameArr = file?.name?.split('.');
//     const suffix = nameArr?.[nameArr.length - 1];
//     const name = file?.name?.slice(0, file.name.length - suffix.length);
//     const fileItem = {
//       ...file,
//       suffix,
//     };
//     return (
//       <div className={style.fileWrapper}>
//         <div className={style.fileContent}>
//           <Spin size='small' spinning={loading}>
//             <a href={fileItem.url} target='_blank' rel='noreferrer'>
//               <div className={style.fileName}>{name}</div>
//             </a>
//           </Spin>
//         </div>
//       </div>
//     );
//   };
//   return (
//     <div className={style.importFilewrapper}>
//       {/* 支持多文件拖拽上传 */}
//       <Dragger
//         {...props}
//         itemRender={(a, b, c, d) => {
//           console.log('itemRender', a, b, c, d);
//         }}
//       >
//         <p className='ant-upload-drag-icon'>
//           <InboxOutlined />
//         </p>
//         <p className='ant-upload-text'>将文件拖拽至此，或点击上传。</p>
//         <p className='ant-upload-hint'>
//           支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件，最大 50 MB
//         </p>
//       </Dragger>
//     </div>
//   );
// };

// export default DraggerFile;
import { InboxOutlined } from '@ant-design/icons';
import I18N from '@src/lang/I18N';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import React from 'react';

import { baseUrl } from '@/api/request';
import { UPLOAD_FILES_URL_SALE } from '@/utils/const';

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: `${baseUrl}${UPLOAD_FILES_URL_SALE}`,
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const App: React.FC = () => (
  <Dragger {...props}>
    <p className='ant-upload-drag-icon'>
      <InboxOutlined />
    </p>
    <p className='ant-upload-text'>{I18N.eca.dragAndDropTheFile}</p>
    <p className='ant-upload-hint'>{I18N.eca.supportPdf}</p>
  </Dragger>
);

export default App;
