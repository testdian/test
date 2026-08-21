import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Select, FormGrid, FormItem, FormLayout } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal, Button } from 'antd';
import React, { useEffect } from 'react';

import {
  addEmissionSourceFactorApi,
  getEmissionSourceParamValueListApi,
} from '@/views/eca/emissionManage/service';
import { EmissionSourceParam } from '@/views/eca/emissionManage/type';
import { COMMON_PARAM_TYPE } from '@/views/eca/util/constant';

import style from './index.module.less';
import { chooseParamsSchema } from './schema';

const { NUMBER, TEXT, SELECT } = COMMON_PARAM_TYPE;

const SchemaField = createSchemaField({
  components: {
    Select,
    Form,
    FormItem,
    FormLayout,
    FormGrid,
  },
});

interface MainParamsModalProps {
  /** 排放源ID */
  emissionSourceId: number;
  /** 模板ID */
  activeKeyTemplateId: number;
  /** 模板参数列表 */
  templateParamsList: EmissionSourceParam[];
  visible: boolean;
  onCancel: () => void;
  onAddMainParamsSuccess: () => void;
}

const MainParamsModal: React.FC<MainParamsModalProps> = ({
  emissionSourceId,
  activeKeyTemplateId,
  templateParamsList,
  visible,
  onCancel,
  onAddMainParamsSuccess,
}) => {
  console.log('templateParamsListtemplateParamsList', templateParamsList);
  const paramsForm = createForm();

  /** 新增主要参数 */
  const handleOk = async () => {
    const values = await paramsForm.submit<{
      paramMain: string;
      paramRelation: string[];
    }>();
    if (values) {
      await addEmissionSourceFactorApi({
        emissionSourceId,
        emissionSourceTemplateId: activeKeyTemplateId as unknown as number,
        mainParamCode: values.paramMain,
        associatedParamCodeList: values.paramRelation,
      });
      onAddMainParamsSuccess();
    }
  };

  /** 获取主要参数列表数据 */
  const getMainParamsList = async () => {
    const { data } = await getEmissionSourceParamValueListApi(
      emissionSourceId,
      activeKeyTemplateId,
    );
    paramsForm.setFieldState('paramMain', state => {
      state.dataSource = data?.data
        ?.filter(item => item.paramType === NUMBER)
        ?.map?.(item => {
          return {
            label: item.paramName,
            value: item.paramCode,
          };
        });
    });
    paramsForm.setFieldState('paramRelation', state => {
      state.dataSource = data?.data
        ?.filter(
          item =>
            (item.paramType === TEXT || item.paramType === SELECT) &&
            item.displayFlag === 1,
        )
        ?.map?.(item => {
          return {
            label: item.paramName,
            value: item.paramCode,
          };
        });
    });
  };

  /** 取消操作 */
  const handleCancel = () => {
    paramsForm.reset();
    onCancel();
  };

  useEffect(() => {
    if (visible) {
      getMainParamsList();
    }
  }, [visible]);

  return (
    <Modal
      width='800px'
      maskClosable={false}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          {I18N.Factors.cancel}
        </Button>,
        <Button key='submit' type='primary' onClick={handleOk}>
          {I18N.base.confirm}
        </Button>,
      ]}
    >
      <div className={style.modalInfoContent}>
        <QuestionCircleOutlined />
        <div>{I18N.eca.mainParametersRequired}</div>
      </div>
      <Form form={paramsForm}>
        <SchemaField schema={chooseParamsSchema()} />
      </Form>
    </Modal>
  );
};

export default MainParamsModal;
