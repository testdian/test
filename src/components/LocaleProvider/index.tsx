import { setValidateLanguage } from '@formily/core';
import kiwiIntl, {
  LocaleType,
  initLocale,
  serviceLangMap,
  serviceLangMapReverse,
} from '@src/lang/I18N';
import { useMount } from 'ahooks';
import { noop } from 'lodash-es';
import {
  createContext,
  useMemo,
  useState,
  useCallback,
  FC,
  PropsWithChildren,
} from 'react';

import { USER_KEY } from '@/store/module/user';
import { isPrototypeDemo } from '@/utils/prototypeDemo';

import { getChangeLang, getLanguage } from './service';

type ChangeLocaleParams = {
  currentLocale: LocaleType;
  onlyFeSwitch?: boolean;
};

export const LocaleContext = createContext<{
  locale: LocaleType;
  changeLocale: ({ currentLocale, onlyFeSwitch }: ChangeLocaleParams) => void;
}>({
  locale: LocaleType.zhCN,
  changeLocale: noop,
});

export const LocaleProvider: FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocale] = useState(initLocale);

  const changeLocale = useCallback(
    async ({ currentLocale, onlyFeSwitch }: ChangeLocaleParams) => {
      if (onlyFeSwitch) {
        setLocale(currentLocale);
        kiwiIntl?.setLang?.(currentLocale);
        setValidateLanguage(currentLocale);
        return;
      }
      await getChangeLang({ langType: serviceLangMap[currentLocale] });

      window.location.reload();
    },
    [],
  );

  useMount(async () => {
    if (isPrototypeDemo()) {
      setValidateLanguage(locale);
      return;
    }
    const storage = localStorage.getItem(USER_KEY) || '{}';
    const parsed = JSON.parse(storage);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!parsed?.accessToken) {
      setValidateLanguage(locale);
      // 未登录状态不去获取
      return;
    }
    if (location.pathname.indexOf('pwd-change') >= 0) {
      return;
    }
    const lang = await getLanguage();
    const currentLocale = serviceLangMapReverse[lang] || LocaleType.zhCN;
    setLocale(currentLocale);
    kiwiIntl?.setLang?.(currentLocale);
    setValidateLanguage(currentLocale);
  });

  const contextValue = useMemo(
    () => ({
      locale,
      changeLocale,
    }),
    [locale, changeLocale],
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};
