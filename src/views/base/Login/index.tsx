/**
 * @description 登陆页
 */
import { LeftOutlined } from '@ant-design/icons';
import I18N, { LocaleType, serviceLangMap } from '@src/lang/I18N';
import { Button, Form, Input, Space } from 'antd';
import Password from 'antd/es/input/Password';
import { includes } from 'lodash-es';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AxiosResponse } from 'axios';

import {
  getCaptchaApi,
  getPublicKeyApi,
  postAuthTokenAccountLoginApi,
} from '@/api/login';
import type { ResponseData } from '@/api/request';
import { getOktaBaseUrl } from '@/api/request';
import LoadingButton from '@/components/LoadingButton';
import { ModifyNote } from '@/components/ModifyNote';
import { LocaleContext } from '@/components/LocaleProvider';
import { RouteMaps } from '@/router/utils/enums';
import { userInfoActions } from '@/store/module/user';
import { getSearchParams, Toast } from '@/utils';
import { constant } from '@/utils/const';
import { encryptDataHandler } from '@/utils/encrypt';
import { ResPassWorld } from '@/views/base/Login/components/RestetPassWorld';

import styles from './index.module.less';
import { LoginInfoDataType } from './type';

export const iconColor = {
  color: '#999EA4',
  fontSize: '16px',
};
const oktaUrl = '/auth/cas/login';

const isCaptchaError = (msg?: string) => {
  if (!msg) return false;
  return msg.includes('验证码') || /verification code|captcha/i.test(msg);
};

const Login = () => {
  const { locale, changeLocale } = useContext(LocaleContext);
  const [changePwdModalVisible, setChangePwdModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm<LoginInfoDataType>();
  const [code, setCode] = useState<{
    img: string;
    uuid: string;
  }>({
    img: '',
    uuid: '',
  });

  const getCaptDataInfo = async () => {
    const { data } = await getCaptchaApi();
    setCode(data.data);
  };

  const refreshCaptchaOnError = async () => {
    await getCaptDataInfo();
    form.setFieldValue('code', '');
  };

  const submit = async () => {
    const values = await form.validateFields();

    // 1. 获取后端公钥
    const publicKeyInfo = await getPublicKeyApi();

    // 调用加密方法
    const encryptedData = await encryptDataHandler(
      {
        ...values,
        langType: serviceLangMap[locale],
        uuid: code.uuid,
        code: values.code,
      },
      publicKeyInfo?.data?.data,
    );

    try {
      const { data } = await postAuthTokenAccountLoginApi({
        encryptedLoginData: encryptedData.requestStr,
        encryptedAesKey: encryptedData.aesKeyValue as string,
        encryptedIv: encryptedData.ivValue as string,
      });

      if (data?.data?.accessToken) {
        Toast('success', I18N.base.loginSuccessful);
        dispatch(userInfoActions.setUserInfo(data?.data));
        const search = getSearchParams()[0];
        if (data?.data?.defaultPassword) {
          window.location.href = RouteMaps.changePWD;
          return;
        }
        if (search[constant.redirectURL]) {
          window.location.href = search[constant.redirectURL];
        } else {
          window.location.href = RouteMaps.home;
        }
      }
    } catch (error) {
      const errorMsg = (error as AxiosResponse<ResponseData>)?.data?.msg;
      if (isCaptchaError(errorMsg)) {
        await refreshCaptchaOnError();
      }
    }
  };

  /** 修改密码成功 */
  const onSuccess = () => {
    setChangePwdModalVisible(false);
  };

  useEffect(() => {
    const browserLanguages = navigator.languages || [navigator.language];
    // 获取浏览器首选语言
    const preferredLanguage = browserLanguages[0];
    if (includes(preferredLanguage, 'zh')) {
      changeLocale({
        currentLocale: LocaleType.zhCN,
        onlyFeSwitch: true,
      });
    } else if (includes(preferredLanguage, 'en')) {
      changeLocale({
        currentLocale: LocaleType.enUS,
        onlyFeSwitch: true,
      });
    }
  }, []);

  useEffect(() => {
    getCaptDataInfo();
  }, []);

  return (
    <div className={styles.wrapper}>
      <img
        src='/login-bg.png'
        alt=''
        className={styles.bgImage}
        draggable={false}
      />
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <div className={styles.headerTitleRow}>
            <span className={styles.createAccount}>碳管理平台</span>
            <ModifyNote content='改成：碳管理平台' />
          </div>
          {/* <img src={logo} alt='logo' className={styles.logo} /> */}
        </div>
        {/* 登录组件 */}
        {!changePwdModalVisible && (
          <Space direction='vertical'>
            <div className={styles.frame2}>
              <Form layout='vertical' className={styles.form} form={form}>
                <Form.Item
                  name='username'
                  label=''
                  rules={[
                    {
                      required: true,
                      message: '请输入账号',
                    },
                  ]}
                >
                  <div className={styles.inputWithNote}>
                    <div className={styles.inputLabel5}>
                      <Input
                        placeholder='账号'
                        variant='borderless'
                        maxLength={100}
                        aria-label='username'
                      />
                    </div>
                    <span className={styles.inputNote}>
                      <ModifyNote content='改为账号：文本框，登录时，外部用户改为通过账号、密码、验证码登录' />
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  name='password'
                  label=''
                  rules={[
                    {
                      required: true,
                      message: I18N.base.pleaseEnterPassword,
                    },
                  ]}
                >
                  <Password
                    className={styles.inputLabel5}
                    maxLength={100}
                    placeholder={I18N.base.password2}
                    aria-label='password'
                  />
                </Form.Item>
                <Form.Item
                  name='code'
                  rules={[
                    {
                      required: true,
                      message: I18N.base.pleaseEnterVerification,
                    },
                  ]}
                >
                  <div className={styles.emailCode}>
                    <Input
                      // prefix={<SafetyCertificateOutlined style={iconColor} />}
                      placeholder={I18N.base.verificationCode}
                      maxLength={100}
                      aria-label='code'
                      className={styles.inputLabel5}
                    />
                    <div className={styles.getEmailCode}>
                      <img src={code.img} alt='' />
                      <ModifyNote content='验证码输入错误则自动刷新' />
                    </div>
                  </div>
                </Form.Item>
              </Form>
              <div className={styles.frame6}>
                <div className={styles.frame7}>
                  <span
                    onClick={() => {
                      setChangePwdModalVisible(true);
                    }}
                    className={styles.terms}
                  >
                    {I18N.base.forgotPassword}
                  </span>
                </div>
                <span
                  onClick={getCaptDataInfo}
                  className={styles.forgotPassword}
                >
                  {I18N.base.cantSeeClearlySwitchToAnotherOne}
                </span>
              </div>
              <LoadingButton
                enableKeyDown={false}
                type='primary'
                className={styles.mainButton}
                onClick={submit}
              >
                {I18N.base.login}
              </LoadingButton>
            </div>
          </Space>
        )}

        {/* 忘记密码组件 */}
        {changePwdModalVisible && <ResPassWorld onSuccess={onSuccess} />}

        {/* 语言切换&返回登录 */}
        <div className={styles.selectLangBox}>
          {/* <SelectLanguage onlyFeSwitch /> */}
          {changePwdModalVisible && (
            <Button
              className={styles.backLoginBtn}
              type='link'
              icon={<LeftOutlined />}
              onClick={() => {
                setChangePwdModalVisible(false);
              }}
            >
              {I18N.base.returnToLogin}
            </Button>
          )}
          {!changePwdModalVisible && (
            <Button
              className={styles.backLoginBtn}
              type='link'
              onClick={async () => {
                const oktaBaseUrl = await getOktaBaseUrl();
                if (oktaBaseUrl) {
                  window.location.href = `${oktaBaseUrl}${oktaUrl}`;
                }
              }}
            >
              {I18N.base.oktaLogin}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
