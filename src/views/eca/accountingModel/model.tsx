/*
 * @@description: 核算模型 新增 编辑  详情
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-01 18:28:58
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-28 20:40:34
 */
import {
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
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { virtualLinkTransform } from '@/router/utils/enums';
import {
  postComputationModelAdd,
  postComputationModelCopy,
  postComputationModelEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import { ORG_STATUS } from '@/utils/const';

import { TextArea } from '../component/TextArea';
import { UseOrgs } from '../hooks';
import { schema } from './unInfo/utils/schemas';

export const StatusText = {
  ADD: I18N.Factors.newAddition,
  SHOW: I18N.eca.display,
  EDIT: I18N.Factors.edit,
  COPY: I18N.carbonFootPrintLCA.copy,
  DEL: I18N.Factors.delete,
} as const;

export const AccountingModel = ({
  status,
  visable,
  onCancelFn,
  onOkFn,
  initValue,
}: {
  status: 'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL';
  visable: boolean;
  onCancelFn: () => void;
  onOkFn: () => void;
  initValue: { [key: string]: any };
}) => {
  const modelForm = createForm({
    readPretty: !(['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0),
    values: initValue,
    effects() {
      onFormInit(async current => {
        const useOrgArr = await UseOrgs();
        current.setFieldState('orgId', {
          dataSource: useOrgArr?.map(item => {
            return {
              label: item.orgName,
              value: item.id,
              disabled: item.orgStatus === ORG_STATUS.DISABLE,
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, [visable]);
  const handleOk = async () => {
    modelForm.submit(async value => {
      setLoading(true);

      if (status === 'ADD') {
        try {
          await postComputationModelAdd({ req: value }).then(({ data }) => {
            if (data.code === 200) {
              onOkFn();
              navigate(
                virtualLinkTransform(
                  EcaRouteMaps.accountingModelEmissionSource,
                  [':id'],
                  [data?.data as string],
                ),
              );
            }
          });
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
      if (status === 'EDIT') {
        try {
          await postComputationModelEdit({
            req: {
              ...value,
              id: initValue.id,
            },
          }).then(({ data }) => {
            if (data.code === 200) {
              onOkFn();
            }
            setLoading(false);
          });
        } catch (error) {
          setLoading(false);
        }
      }
      if (status === 'COPY') {
        try {
          await postComputationModelCopy({
            req: {
              ...value,
              id: initValue.id,
            },
          }).then(({ data }) => {
            if (data.code === 200) {
              onOkFn();
              navigate(
                virtualLinkTransform(
                  EcaRouteMaps.accountingModelEmissionSource,
                  [':id'],
                  [data?.data as string],
                ),
              );
            }
            setLoading(false);
          });
        } catch (error) {
          setLoading(false);
        }
      }
    });
  };
  const handleCancel = () => {
    onCancelFn();
  };
  return (
    <Modal
      centered
      title={I18N.template(I18N.eca.statu, { val1: StatusText[status] })}
      open={visable}
      maskClosable={false}
      footer={[
        <Button key='back' onClick={handleCancel}>
          {' '}
          {I18N.Factors.cancel}
        </Button>,
        ['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0 && (
          <Button
            key='submit'
            type='primary'
            // disabled={loading}
            loading={loading}
            onClick={handleOk}
          >
            {status === 'EDIT' ? I18N.Factors.preserve : I18N.eca.saveNextStep}
          </Button>
        ),
      ]}
      onOk={() => {}}
      onCancel={() => {
        onCancelFn();
        setLoading(false);
      }}
    >
      <Form form={modelForm} previewTextPlaceholder='-'>
        <SchemaField schema={schema(status)} />
      </Form>
    </Modal>
  );
};
