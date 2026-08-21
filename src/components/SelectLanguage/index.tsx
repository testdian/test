/**
 * @description 多语言切换框
 */
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { serviceLangMap, serviceLangMapReverse } from '@src/lang/I18N';
import { Dropdown, Menu, MenuProps, Popover, Space } from 'antd';
import { useContext, useEffect, useState } from 'react';

import Union from '@/image/Union.svg';
import store from '@/store';

import style from './index.module.less';
import { OptionsType, getLangList } from './service';
import { LocaleContext } from '../LocaleProvider';

export const SelectLanguage = ({
  onlyFeSwitch = false,
}: {
  onlyFeSwitch?: boolean;
}) => {
  const { changeLocale, locale } = useContext(LocaleContext);

  /** 语言列表 */
  const [langOption, setLangOption] = useState<OptionsType[]>([]);

  /** 获取多语言枚举 */
  const getLangOption = async () => {
    const token = store.getState().userInfo.accessToken;
    if (token) {
      // langType写死1
      const { data } = await getLangList({ langType: 1 });
      const options = data.data;
      setLangOption(options || []);
    } else {
      // 登陆页没有token
      /** 登陆页多语言枚举 */
      const loginPageOptions = [
        {
          id: 1,
          i18nType: 1,
          i18nType_name: '语言',
          langType: 1,
          fieldKey: 1,
          fieldValue: '中',
        },
        {
          id: 2,
          i18nType: 1,
          i18nType_name: '语言',
          langType: 1,
          fieldKey: 2,
          fieldValue: 'EN',
        },
      ];
      setLangOption(loginPageOptions || []);
    }
  };

  useEffect(() => {
    getLangOption();
  }, []);

  const onClick: MenuProps['onClick'] = info => {
    changeLocale({
      currentLocale: serviceLangMapReverse[Number(info.key)],
      onlyFeSwitch,
    });
  };

  const items: MenuProps['items'] = langOption.map(item => {
    return {
      key: item.fieldKey,
      label: <div>{item.fieldValue}</div>,
    };
  });

  return (
    <Dropdown menu={{ items, onClick }} placement='bottom'>
      <Space className={style.chooseLanguageBox}>
        <div className={style.chooseLanguageBoxContainer}>
          <div className={style.language}>
            <img src={Union} className={style.vector} alt='chooseLanguage' />
          </div>
          <span className={style.chinese}>
            {
              langOption.find(item => item?.fieldKey === serviceLangMap[locale])
                ?.fieldValue
            }
          </span>
          <DownOutlined className={style.menuIconExpand} />
        </div>
      </Space>
    </Dropdown>
  );
};

export const PopoverSelectLanguage = ({
  onlyFeSwitch = false,
}: {
  onlyFeSwitch?: boolean;
}) => {
  const { changeLocale, locale } = useContext(LocaleContext);

  /** 语言列表 */
  const [langOption, setLangOption] = useState<OptionsType[]>([]);

  /** 获取多语言枚举 */
  const getLangOption = async () => {
    const token = store.getState().userInfo.accessToken;
    if (token) {
      // langType写死1
      const { data } = await getLangList({ langType: 1 });
      const options = data.data;
      setLangOption(options || []);
    } else {
      // 登陆页没有token
      /** 登陆页多语言枚举 */
      const loginPageOptions = [
        {
          id: 1,
          i18nType: 1,
          i18nType_name: '语言',
          langType: 1,
          fieldKey: 1,
          fieldValue: '中',
        },
        {
          id: 2,
          i18nType: 1,
          i18nType_name: '语言',
          langType: 1,
          fieldKey: 2,
          fieldValue: 'EN',
        },
      ];
      setLangOption(loginPageOptions || []);
    }
  };

  useEffect(() => {
    getLangOption();
  }, []);

  const onClick: MenuProps['onClick'] = info => {
    changeLocale({
      currentLocale: serviceLangMapReverse[Number(info.key)],
      onlyFeSwitch,
    });
  };

  const items: MenuProps['items'] = langOption.map(item => {
    return {
      key: item.fieldKey,
      label: <div>{item.fieldValue === '中' ? '简体中文' : 'English'}</div>,
    };
  });

  const content = (
    <Menu className={style.menuInfo} onClick={onClick} items={items} />
  );

  return (
    <Popover
      content={content}
      placement='rightBottom'
      trigger='click'
      arrow={false}
    >
      <div className={style.profileContainer}>
        <div className={style.userInfo}>
          <div className={style.userInfoContent}>
            <div className={style.languageIcon} />
            <span className={style.username}>
              {langOption.find(
                item => item?.fieldKey === serviceLangMap[locale],
              )?.fieldValue === '中'
                ? '简体中文'
                : 'English'}
            </span>
          </div>
          <RightOutlined style={{ fontSize: 12 }} />
        </div>
      </div>
    </Popover>
  );
};
