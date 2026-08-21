import {
  FormItem,
  FormGrid,
  FormLayout,
  Form,
  NumberPicker,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal } from 'antd';
import { FC, useEffect } from 'react';

import { ModalFooter } from '@/components/ModalFooter';
import { PageTypeInfo } from '@/router/utils/enums';

import style from './index.module.less';
import { fillDataFormSchema } from './schema';
import { PeriodTypeEnum } from '../../const';
import { updateIndicatorTableApi } from '../../service';
import { IndicatorInfoTableItemDatum } from '../../type';

interface FillDataIndicatorTableModalProps {
  /** tableModalType 弹窗状态 */
  tableModalType: PageTypeInfo;
  /** 数据录入周期   */
  indexDataPeriod: PeriodTypeEnum;
  indicatorInfo: IndicatorInfoTableItemDatum;
  visible: boolean;
  onCancel: () => void;
  onSuccessSave: () => void;
}
const SchemaField = createSchemaField({
  components: {
    FormItem,
    NumberPicker,
    FormGrid,
    FormLayout,
  },
});

const FillDataIndicatorTableModal: FC<FillDataIndicatorTableModalProps> = ({
  tableModalType,
  indexDataPeriod,
  indicatorInfo,
  visible,
  onCancel,
  onSuccessSave,
}) => {
  const form = createForm({
    readPretty: tableModalType === PageTypeInfo.show,
  });

  const handleOk = async () => {
    const values = await form.submit<IndicatorInfoTableItemDatum>();
    await updateIndicatorTableApi({ ...values, id: indicatorInfo.id });
    onSuccessSave();
    form.reset();
  };

  const onCancelInit = () => {
    form.reset();
    onCancel();
  };

  useEffect(() => {
    form.setValues(indicatorInfo);
  }, [indicatorInfo?.id]);

  return (
    <Modal
      width={600}
      title={undefined}
      open={visible}
      onCancel={onCancelInit}
      onOk={handleOk}
      destroyOnClose
      maskClosable={false}
      footer={
        <ModalFooter
          isView={tableModalType === PageTypeInfo.show}
          onCancel={onCancelInit}
          onOk={handleOk}
          cancelText={I18N.Factors.cancel}
          okText={I18N.Factors.preserve}
        />
      }
    >
      <div className={style.modalInfoContent}>
        {I18N.eca.organizationName}
        <span>{indicatorInfo?.orgName}</span>
      </div>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={fillDataFormSchema(indexDataPeriod)} />
      </Form>
    </Modal>
  );
};

export default FillDataIndicatorTableModal;
