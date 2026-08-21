/**
 * @description:账号管理
 */

import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Password,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AntProvider } from '@/components/AntdProvider';
import { Button } from '@/components/Form/Button';
import { FormActions } from '@/components/FormActions';
import { FormilyCustomTitle } from '@/components/formily/ComTitle';
import {
  getSystemUserId,
  postSystemUserPasswordModify,
} from '@/sdks/systemV2ApiDocs';
import { Toast } from '@/utils';
import { PassWordText } from '@/views/base/ChangePWD/components/PassWordText';

import style from './index.module.less';
import { changePwdSchema, schema } from './schemas';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    Button,
    Password,
    FormilyCustomTitle,
  },
});

function AccountManage() {
  const [changePwdModalVisible, setChangePwdModalVisible] = useState(false);
  const { id } = useParams<{
    id: string;
  }>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: true,
      }),
    [],
  );

  useEffect(() => {
    if (!Number.isNaN(Number(id))) {
      getSystemUserId({ id: Number(id) }).then(({ data }) => {
        const result = data?.data || {};
        form.setValues({
          ...result,
          orgs: result.orgNames,
          roles: result.roleNames,
        });
      });
    }
  }, [id]);

  const changePwdForm = createForm();
  return (
    <AntProvider>
      <div className={style.wrapper}>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField
            schema={schema({
              onChangePwd: async () => {
                setChangePwdModalVisible(true);
              },
            })}
          />
        </Form>
        <Modal
          open={changePwdModalVisible}
          onCancel={() => {
            setChangePwdModalVisible(false);
          }}
          maskClosable={false}
          onOk={() => {
            return changePwdForm.submit(values => {
              return postSystemUserPasswordModify({ req: values }).then(
                ({ data }) => {
                  if (data.code === 200) {
                    Toast('success', I18N.dashborad.changePasswordTo);
                    setChangePwdModalVisible(false);
                  }
                },
              );
            });
          }}
          title={I18N.base.changePassword}
          okText={I18N.base.confirm}
          cancelText={I18N.Factors.cancel}
        >
          <Form form={changePwdForm}>
            <SchemaField
              schema={changePwdSchema()}
              scope={{ validatePwdTip: I18N.base.self }}
            />
          </Form>
          <PassWordText />
        </Modal>
        <FormActions
          place='center'
          buttons={compact([
            {
              title: I18N.Factors.return,
              type: 'default',
              onClick: async () => {
                history.back();
              },
            },
          ])}
        />
      </div>
    </AntProvider>
  );
}

export default AccountManage;
