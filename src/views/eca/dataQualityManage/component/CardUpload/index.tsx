/*
 * @@description: 卡片图片上传
 */

import { UploadOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import { useField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { message, Upload, UploadProps } from 'antd';

import { baseUrl } from '@/api/request';
import { UPLOAD_FILES_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { maxSize, reg } from '@/views/eca/util/type';

const CardUpload = (props: UploadProps & { isEdit?: boolean }) => {
  const filed = useField<Field>();
  console.log(props, 'props-props');
  return (
    <Upload
      {...props}
      fileList={filed.value}
      action={`${baseUrl}${UPLOAD_FILES_URL}`}
      listType='picture-card'
      headers={{
        Authorization: getToken(),
      }}
      onChange={({ fileList: newFileList }) => {
        // @ts-ignore
        const newArr = newFileList.map((item, index) => {
          if (item.status === 'done' && item.originFileObj) {
            if (item.response.code === 200) {
              return {
                url: item.response.data?.url,
                uid: index,
                name: item.response.data?.fileName,
              };
            }
          }
          return item;
        });
        // getIfilePath([...fileData]);
        filed.setValue([...newArr]);
        // props.onChange(newArr);
      }}
      maxCount={props?.maxCount || 5}
      beforeUpload={(e: { size: number; name: string }) => {
        if (e.size > maxSize) {
          message.error(I18N.eca.supportedImages);
          return Upload.LIST_IGNORE;
        }
        if (!reg.test(e.name)) {
          message.error(I18N.eca.supportedImages);
          return Upload.LIST_IGNORE;
        }
        return true;
      }}
    >
      {(filed?.value?.length < (props?.maxCount as unknown as number) || 0) &&
      !window.location.pathname.includes('show') ? (
        props?.isEdit ? (
          <div className='customUpload'>
            <UploadOutlined style={{ fontSize: 20 }} />
            <div style={{ marginTop: 8 }}>
              <span>{I18N.eca.uploadImages}</span>
            </div>
          </div>
        ) : (
          ''
        )
      ) : (
        ''
      )}
    </Upload>
  );
};
export default CardUpload;
