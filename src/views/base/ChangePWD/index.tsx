/*
 * @@description: 修改密码
 */
import { Form, FormItem, FormLayout, Password } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import I18N from '@src/lang/I18N';
import { Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getPublicKeyApi, postAuthTokenAccountResetPwdApi } from '@/api/login';
import Logo from '@/components/SidebarLogo';
import { RouteMaps } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { encryptDataHandler } from '@/utils/encrypt';

import { PassWordText } from './components/PassWordText';
import style from './index.module.less';
import { changePwdSchemas } from './utils';

const SchemaField = createSchemaField({
  components: {
    Password,
    FormLayout,
    FormItem,
  },
});

const ChangePWD = () => {
  const form = createForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className={style.wrapper}>
      <div className={style.logoContainer}>
        <Logo />
      </div>
      <div className={style.main}>
        <div className={style.inner}>
          <header>{I18N.base.changePassword}</header>
          <div className={style.tip}>{I18N.base.forGreaterSafety}</div>
          <Form form={form} className={style.form}>
            <SchemaField
              schema={{
                type: 'object',
                properties: {
                  layout: {
                    type: 'void',
                    'x-component': 'FormLayout',
                    'x-component-props': {
                      layout: 'vertical',
                    },
                    properties: changePwdSchemas(),
                  },
                },
              }}
              scope={{ validatePwdTip: I18N.base.self }}
            />
          </Form>
          <Button
            loading={loading}
            type='primary'
            className={style.submit}
            onClick={() => {
              return form.submit(async values => {
                setLoading(true);
                // 1. 获取后端公钥
                const publicKeyInfo = await getPublicKeyApi();
                // 调用加密方法
                const encryptedData = await encryptDataHandler(
                  {
                    ...values,
                  },
                  publicKeyInfo?.data?.data,
                );
                return postAuthTokenAccountResetPwdApi({
                  encryptedLoginData: encryptedData.requestStr,
                  encryptedAesKey: encryptedData.aesKeyValue as string,
                  encryptedIv: encryptedData.ivValue as string,
                })
                  .then(({ data }) => {
                    if (data?.code === 200) {
                      Toast('success', I18N.dashborad.changePasswordTo);
                      navigate(RouteMaps.home);
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              });
            }}
          >
            {I18N.base.confirm}
          </Button>
          <PassWordText />
          {/* 语言切换&返回登录 */}
          <div className={style.selectLangBox}>
            {/* <SelectLanguage onlyFeSwitch /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePWD;
