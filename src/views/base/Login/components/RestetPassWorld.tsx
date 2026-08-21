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
import { Button } from 'antd';
import { useMemo, useContext } from 'react';

import {
  getLosePassApi,
  postLoginInnerModifyPasswordApi,
} from '@/api/authData';
import { getPublicKeyApi } from '@/api/login';
import { FormilyComsButton } from '@/components/Form/Button';
import { LocaleContext } from '@/components/LocaleProvider';
import { FormilyCustomTitle } from '@/components/formily/ComTitle';
import I18N, { serviceLangMap } from '@/lang/I18N';
import { Toast } from '@/utils';
import { encryptDataHandler } from '@/utils/encrypt';
import { changeLoginPwdSchema } from '@/views/dashborad/AccountManage/schemas';

import pwdStyles from './index.module.less';
import { PassWordText } from '../../ChangePWD/components/PassWordText';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    FormilyComsButton,
    Password,
    FormilyCustomTitle,
  },
});

export const ResPassWorld = ({ onSuccess }: { onSuccess: () => void }) => {
  const { locale } = useContext(LocaleContext);
  const changePwdForm = useMemo(() => createForm(), [locale]);
  const handleButtonClick = async () => {
    const username = changePwdForm.getValuesIn('username');
    if (username) {
      /** 发送验证码 */
      const { data } = await getLosePassApi({
        username,
        langType: serviceLangMap[locale],
      });
      Toast('success', I18N.base.verificationCodeHasBeenSent);
      return data;
    }
    return changePwdForm.validate('username');
  };

  const changePwdFormSubmit = async () => {
    const values = await changePwdForm.submit<Record<string, any>>();
    // 1. 获取后端公钥
    const publicKeyInfo = await getPublicKeyApi();
    // 调用加密方法
    const encryptedData = await encryptDataHandler(
      {
        username: values.username,
        code: values.code,
        password: values.newPassword,
        langType: serviceLangMap[locale],
      },
      publicKeyInfo?.data?.data,
    );

    /** 修改密码 */
    await postLoginInnerModifyPasswordApi({
      encryptedLoginData: encryptedData.requestStr,
      encryptedAesKey: encryptedData.aesKeyValue as string,
      encryptedIv: encryptedData.ivValue as string,
    });
    Toast('success', I18N.dashborad.changePasswordTo);
    changePwdForm.reset();
    onSuccess?.();
  };

  return (
    <div>
      <Form form={changePwdForm} previewTextPlaceholder='-'>
        <SchemaField
          schema={changeLoginPwdSchema({
            onClick: handleButtonClick,
          })}
          scope={{ validatePwdTip: I18N.base.self }}
        />
      </Form>
      <PassWordText />
      <Button
        className={pwdStyles.changePwdFormSubmit}
        onClick={changePwdFormSubmit}
        type='primary'
      >
        {I18N.carbonFootPrintLCA.confirm1}
      </Button>
    </div>
  );
};
