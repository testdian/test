/**
 * @description 数据质量控制弹窗
 */
import {
  Cascader,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd-v5';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button, message } from 'antd';

import { AntProvider } from '@/components/AntdProvider';
import CustomDrawer from '@/components/CustomDrawer';
import {
  postComputationControlPlanAdd,
  postComputationControlPlanCopy,
  postComputationControlPlanProductAdd,
  postComputationControlPlanProductEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  changeFactorM2cascaderOptions,
  gasEnumsMap,
} from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import { controlSchema, schema } from './schema';
import { TextArea } from '../../component/TextArea';
import { useOrganizationSelect } from '../../hooks/useOrganizationSelect';

export const StatusText = {
  ADD: I18N.Factors.newAddition,
  SHOW: I18N.Factors.check,
  EDIT: I18N.Factors.edit,
  COPY: I18N.carbonFootPrintLCA.copy,
  DEL: I18N.Factors.delete,
} as const;

export const DataQualityModel = ({
  status,
  visible,
  onCancelFn,
  onOkFn,
  initValue,
}: {
  status: 'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL';
  visible: boolean;
  onCancelFn: () => void;
  onOkFn: () => void;
  initValue: { [key: string]: any };
}) => {
  const { getBrandOrgOptions } = useOrganizationSelect();
  const brandEnum = getBrandOrgOptions();
  const modelForm = createForm({
    readPretty: !(['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0),
    initialValues: initValue,
    effects() {
      onFormInit(async current => {
        // 获取当前用户下的组织
        current.setFieldState('orgId', {
          dataSource: brandEnum?.map?.(item => {
            return {
              label: `${item.label}`,
              value: item.value,
            };
          }),
        });
      });
    },
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
      TextArea,
    },
  });
  const handleCancel = () => {
    onCancelFn();
  };
  const handleOk = () => {
    modelForm.submit(async value => {
      if (status === 'ADD') {
        await postComputationControlPlanAdd({
          req: { ...value },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
            message.success(I18N.Factors.saveSuccessful);
          }
        });
      }
      if (status === 'COPY') {
        await postComputationControlPlanCopy({
          req: { ...value, id: initValue.id },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
            message.success(I18N.Factors.saveSuccessful);
          }
        });
      }
    });
  };
  return (
    <CustomDrawer
      width='50%'
      title={I18N.template(I18N.eca.statu3, { val1: StatusText[status] })}
      visible={visible}
      footer={[
        <Button key='back' onClick={handleCancel}>
          {I18N.Factors.cancel}
        </Button>,
        ['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0 && (
          <Button key='submit' type='primary' onClick={handleOk}>
            {I18N.Factors.preserve}
          </Button>
        ),
      ]}
      onClose={handleCancel}
    >
      <AntProvider>
        <Form form={modelForm} previewTextPlaceholder='-'>
          <SchemaField schema={schema()} />
        </Form>
      </AntProvider>
    </CustomDrawer>
  );
};

/** 新增产品或服务抽屉 */
export const ProductDrawer = ({
  status,
  visible,
  onCancelFn,
  onOkFn,
  initValue,
}: {
  status: 'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL';
  visible: boolean;
  onCancelFn: () => void;
  onOkFn: () => void;
  initValue: { [key: string]: any };
}) => {
  const enums = useAllEnumsBatch(
    `${Object.values(gasEnumsMap).join(',')},factorUnitM`,
  );
  const modelForm = createForm({
    readPretty: !(['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0),
    initialValues: initValue,
    effects() {
      onFormInit(async currentForm => {
        currentForm.setFieldState('serviceUnit', {
          dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
        });
      });
    },
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
      Cascader,
      TextArea,
    },
  });
  const handleCancel = () => {
    onCancelFn();
  };
  const handleOk = () => {
    modelForm.submit(async value => {
      const controlPlanId =
        new URLSearchParams(location.search).get('id') || '';

      if (status === 'ADD') {
        await postComputationControlPlanProductAdd({
          req: {
            ...value,
            controlPlanId: Number(controlPlanId),
            serviceUnit: value?.serviceUnit?.toString(),
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
          }
        });
      }
      if (status === 'EDIT') {
        await postComputationControlPlanProductEdit({
          req: {
            ...value,
            controlPlanId: Number(controlPlanId),
            serviceUnit: value?.serviceUnit?.toString(),
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
          }
        });
      }
    });
  };
  return (
    <CustomDrawer
      width='50%'
      title={I18N.template(I18N.eca.statu2, { val1: StatusText[status] })}
      visible={visible}
      maskClosable={false}
      footer={[
        <Button key='back' onClick={handleCancel}>
          {' '}
          {I18N.Factors.cancel}
        </Button>,
        ['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0 && (
          <Button key='submit' type='primary' onClick={handleOk}>
            {I18N.Factors.preserve}
          </Button>
        ),
      ]}
      onClose={() => {
        onCancelFn();
      }}
    >
      <AntProvider>
        <Form form={modelForm} previewTextPlaceholder='-'>
          <SchemaField schema={controlSchema()} />
        </Form>
      </AntProvider>
    </CustomDrawer>
  );
};
