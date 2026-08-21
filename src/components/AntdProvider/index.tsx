import { AntdLocale } from '@src/lang/I18N';
import { ConfigProvider, Empty, theme } from 'antd';
import 'moment/dist/locale/zh-cn';
import { FC, PropsWithChildren, useContext, useMemo } from 'react';

import { Colors } from '@/styles/var';

import I18N from '../../lang/I18N';
import { LocaleContext } from '../LocaleProvider';

// 暂无数据
export const customizeRenderEmpty = () => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={<span>{I18N.utils.noData}</span>}
  />
);

const { useToken } = theme;
export const AntProvider: FC<PropsWithChildren> = ({ children }) => {
  const { locale } = useContext(LocaleContext);

  const { token } = useToken();

  const antdLocale = useMemo(() => {
    return AntdLocale[locale];
  }, [locale]);

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          ...Colors,
          fontFamily: `'Alibaba PuHuiTi',${token.fontFamily}`,
        },
        components: {
          Modal: {
            colorPrimary: '#002855',
            colorBgContainer: '#fff',
          },
          Tabs: {},
          Button: {
            primaryShadow: 'none',
            // colorError: '#FF4D00',
          },
        },
      }}
      locale={antdLocale}
      renderEmpty={customizeRenderEmpty}
    >
      {children}
    </ConfigProvider>
  );
};
