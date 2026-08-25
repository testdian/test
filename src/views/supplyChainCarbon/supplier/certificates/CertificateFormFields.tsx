import { UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Upload, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { UploadFile } from 'antd/es/upload/interface';

import { FormLabelWithNote } from '@/components/ModifyNote';

import {
  CERT_ATTACHMENT_ACCEPT,
  CERT_ATTACHMENT_MAX_FILES,
  CERT_ATTACHMENT_TIP,
  CERT_CATEGORY_KIND_OPTIONS,
  isCertificateDateRangeValid,
  MAX_CERT_TEXT_LENGTH,
  SUPPLIER_CERT_FORM_NOTE,
  validateAttachmentFile,
  type CertificateFormValues,
} from './certificate-form';

type CertificateFormFieldsProps = {
  form: FormInstance<CertificateFormValues>;
  readOnly?: boolean;
  showVersion?: boolean;
};

export function CertificateFormFields({
  form,
  readOnly = false,
  showVersion = false,
}: CertificateFormFieldsProps) {
  const categoryKind = Form.useWatch('category_kind', form);

  return (
    <>
      {showVersion && (
        <Form.Item name='version' label='版本号'>
          <Input disabled />
        </Form.Item>
      )}

      <Form.Item
        name='cert_name'
        label='证书名称'
        rules={
          readOnly
            ? undefined
            : [
                { required: true, whitespace: true, message: '请输入证书名称' },
                {
                  max: MAX_CERT_TEXT_LENGTH,
                  message: `不超过${MAX_CERT_TEXT_LENGTH}个字符`,
                },
              ]
        }
      >
        <Input
          maxLength={MAX_CERT_TEXT_LENGTH}
          showCount
          placeholder='请输入证书名称'
          disabled={readOnly}
        />
      </Form.Item>

      <Form.Item
        name='category_kind'
        label={
          <FormLabelWithNote label='证书类别' note={SUPPLIER_CERT_FORM_NOTE} />
        }
        rules={[{ required: !readOnly, message: '请选择证书类别' }]}
      >
        <Select
          placeholder='请选择证书类别'
          options={CERT_CATEGORY_KIND_OPTIONS}
          disabled={readOnly}
        />
      </Form.Item>

      {categoryKind === '其他' && (
        <Form.Item
          name='custom_category'
          label='证书类别名称'
          rules={
            readOnly
              ? undefined
              : [
                  { required: true, message: '请输入证书类别' },
                  {
                    max: MAX_CERT_TEXT_LENGTH,
                    message: `不超过${MAX_CERT_TEXT_LENGTH}个字符`,
                  },
                ]
          }
        >
          <Input
            maxLength={MAX_CERT_TEXT_LENGTH}
            showCount
            placeholder='请输入证书类别'
            disabled={readOnly}
          />
        </Form.Item>
      )}

      <Form.Item
        name='cert_no'
        label='证书编号'
        rules={
          readOnly
            ? undefined
            : [
                {
                  max: MAX_CERT_TEXT_LENGTH,
                  message: `不超过${MAX_CERT_TEXT_LENGTH}个字符`,
                },
              ]
        }
      >
        <Input
          maxLength={MAX_CERT_TEXT_LENGTH}
          showCount
          placeholder='请输入证书编号'
          disabled={readOnly}
        />
      </Form.Item>

      <Form.Item
        name='issuer'
        label='签发机构'
        rules={
          readOnly
            ? undefined
            : [
                {
                  max: MAX_CERT_TEXT_LENGTH,
                  message: `不超过${MAX_CERT_TEXT_LENGTH}个字符`,
                },
              ]
        }
      >
        <Input
          maxLength={MAX_CERT_TEXT_LENGTH}
          showCount
          placeholder='请输入签发机构'
          disabled={readOnly}
        />
      </Form.Item>

      <Form.Item
        name='issued_at'
        label='签发日期'
        rules={[{ required: !readOnly, message: '请选择签发日期' }]}
      >
        <DatePicker style={{ width: '100%' }} disabled={readOnly} />
      </Form.Item>

      <Form.Item
        name='expired_at'
        label='有效期至'
        dependencies={['issued_at']}
        rules={
          readOnly
            ? undefined
            : [
                { required: true, message: '请选择有效期至' },
                {
                  validator: async (
                    _,
                    expiredAt?: CertificateFormValues['expired_at'],
                  ) => {
                    const issuedAt = form.getFieldValue('issued_at');
                    if (isCertificateDateRangeValid(issuedAt, expiredAt)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('签发日期需小于有效期'));
                  },
                },
              ]
        }
      >
        <DatePicker style={{ width: '100%' }} disabled={readOnly} />
      </Form.Item>

      <Form.Item
        name='attachments'
        label='附件'
        valuePropName='fileList'
        getValueFromEvent={(event: { fileList: UploadFile[] }) =>
          event?.fileList
        }
        tooltip={CERT_ATTACHMENT_TIP}
        rules={
          readOnly
            ? undefined
            : [
                {
                  validator: async (_, fileList?: UploadFile[]) => {
                    if (!fileList?.length) {
                      return Promise.reject(new Error('请上传附件'));
                    }
                    return Promise.resolve();
                  },
                },
              ]
        }
      >
        <Upload
          accept={CERT_ATTACHMENT_ACCEPT}
          maxCount={CERT_ATTACHMENT_MAX_FILES}
          multiple
          disabled={readOnly}
          beforeUpload={file => {
            const error = validateAttachmentFile(file);
            if (error) {
              message.error(error);
              return Upload.LIST_IGNORE;
            }
            return false;
          }}
        >
          {!readOnly && <Button icon={<UploadOutlined />}>上传附件</Button>}
        </Upload>
      </Form.Item>
    </>
  );
}
