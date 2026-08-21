import I18N from '@src/lang/I18N';
import { Result, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { RouteMaps } from '@/router/utils/enums';
import { userInfoActions } from '@/store/module/user';
import { Toast } from '@/utils';

import { tokenLoginApi } from './service';

const LoginSuccess: React.FC = () => {
  const dispatch = useDispatch();
  const getAuthToken = async () => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      dispatch(
        userInfoActions.setUserInfo({
          accessToken: token,
        }),
      );
      const { data } = await tokenLoginApi();
      if (data?.data) {
        dispatch(userInfoActions.setUserInfo(data?.data));
        if (data?.data?.defaultPassword) {
          window.location.href = RouteMaps.changePWD;
          return;
        }
        window.location.href = RouteMaps.home;
      } else {
        Toast('warning', I18N.base.loginFailedPlease);
      }
    }
  };

  useEffect(() => {
    getAuthToken();
  }, []);

  return (
    <Result
      status='info'
      subTitle={I18N.base.loggingIn}
      extra={[<Spin size='large' />]}
    />
  );
};

export default LoginSuccess;
