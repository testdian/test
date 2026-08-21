/**
 * @description: 审核弹窗
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
} from '@formily/antd-v5';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal, Button } from 'antd';
import { useMemo } from 'react';

import { TextArea } from '@/views/eca/component/TextArea';

import { schema } from './utils/schemas';
import { AuditListType } from '../../utils/type';

export const ApproveModal = ({
  open,
  handleCancel,
  handleOk,
}: {
  /** 弹窗的显隐 */
  open: boolean;
  /** 关闭弹窗的方法 */
  handleCancel: () => void;
  /** 弹窗确定按钮的方法 */
  handleOk: (value: AuditListType) => void;
}) => {
  const SchemaField = createSchemaField({
    components: {
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      Radio,
      Input,
      TextArea,
    },
  });
  const form = useMemo(() => {
    return createForm({
      effects() {
        onFieldValueChange('auditStatus', () => {
          form.reset('auditComment');
        });
      },
    });
  }, [open]);
  return (
    <Modal
      centered
      title={I18N.router.approval}
      open={open}
      maskClosable={false}
      onCancel={handleCancel}
      footer={[
        <Button
          onClick={() => {
            handleCancel();
          }}
        >
          {I18N.Factors.cancel}
        </Button>,
        <Button
          onClick={async () => {
            const value = await form.submit<AuditListType>();
            handleOk(value);
          }}
          type='primary'
        >
          {I18N.carbonFootPrintLCA.confirm}
        </Button>,
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>
    </Modal>
  );
};
