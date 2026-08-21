/*
 * @@description:布局设置 - 暂不使用
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-23 10:59:48
 */

import {
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Drawer, Tooltip, Divider, List, Select, Switch } from 'antd';
import { memo, useState, useCallback } from 'react';
import './index.less';
import { useSelector, useDispatch } from 'react-redux';

import { updateSettings } from '@/store/module/systemSettings';
import { RootState } from '@/store/types';

import { IconFont } from '../IconFont';

interface SettingsBodyProps {
  children: React.ReactNode;
  title: string;
}

function SettingsBody({ title, children }: SettingsBodyProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 className='layout__settings__title'>{title}</h3>
      {children}
    </div>
  );
}

interface SettingsCheckBoxProps {
  value: string;
  onChange: (key: any) => void;
  list: {
    title: string;
    key: string;
    url: string;
  }[];
}

function SettingsCheckBox({ list, onChange, value }: SettingsCheckBoxProps) {
  return (
    <div className='layout__settings__checkbox' key={value}>
      {list.map(item => (
        <Tooltip title={item.title} key={item.key}>
          <div
            className='layout__settings__checkbox-item'
            onClick={() => onChange(item.key)}
          >
            <img src={item.url} alt={item.key} />
            <div
              className='layout__settings__checkbox--check'
              style={{
                display: value === item.key ? 'block' : 'none',
              }}
            >
              <CheckOutlined />
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}

function LayoutSettings() {
  const dispatch = useDispatch();
  const systemSettings = useSelector((s: RootState) => s.systemSettings);
  const [visible, setVisible] = useState(false);

  const onVisibleClick = () => {
    setVisible(!visible);
  };

  const onChange = useCallback(
    (key: string, value: string | boolean) => {
      dispatch(
        updateSettings({
          ...systemSettings,
          [`${key}`]: value,
        }),
      );
    },
    [systemSettings],
  );

  return (
    <>
      <div
        className='layout-settings__controls'
        onClick={() => setVisible(true)}
      >
        <IconFont icon='icon-icon-gonggaoshezhi' />
      </div>
      <Drawer
        placement='right'
        closable
        open={visible}
        width={300}
        onClose={onVisibleClick}
        // @ts-ignore  //FIXME -
        handler={
          <div
            className='layout__settings'
            style={{
              color: '#fff',
              fontSize: 20,
            }}
            onClick={onVisibleClick}
          >
            {visible ? <CloseOutlined /> : <SettingOutlined />}
          </div>
        }
      >
        <SettingsBody title='整体风格设置'>
          <SettingsCheckBox
            value={systemSettings.theme}
            onChange={value => onChange('theme', value)}
            list={[
              {
                title: '暗黑菜单风格',
                key: 'dark',
                url: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg',
              },
              {
                title: '亮色菜单风格',
                key: 'light',
                url: 'https://gw.alipayobjects.com/zos/antfincdn/NQ%24zoisaD2/jpRkZQMyYRryryPNtyIC.svg',
              },
            ]}
          />
        </SettingsBody>

        <Divider />

        <SettingsBody title='导航模式'>
          <SettingsCheckBox
            value={systemSettings.layout}
            onChange={value => onChange('layout', value)}
            list={[
              {
                title: '侧边菜单布局',
                key: 'side',
                url: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg',
              },
              {
                title: '顶部菜单布局',
                key: 'top',
                url: 'https://gw.alipayobjects.com/zos/antfincdn/URETY8%24STp/KDNDBbriJhLwuqMoxcAr.svg',
              },
            ]}
          />
        </SettingsBody>

        <List
          split={false}
          dataSource={[
            {
              title: '内容区域宽度',
              action: (
                <Select
                  size='small'
                  defaultValue={systemSettings.contentWidth}
                  onChange={(value: string) => onChange('contentWidth', value)}
                >
                  {systemSettings.layout === 'top' && (
                    <Select.Option value='fixed'>定宽</Select.Option>
                  )}
                  <Select.Option value='fluid'>流式</Select.Option>
                </Select>
              ),
            },
            {
              title: '固定Header',
              action: (
                <Switch
                  size='small'
                  defaultChecked={systemSettings.fixedHeader}
                  onChange={value => onChange('fixedHeader', value)}
                />
              ),
            },
          ]}
          renderItem={item => (
            <List.Item
              style={{ justifyContent: 'space-between' }}
              actions={[item.action]}
            >
              <span>{item.title}</span>
            </List.Item>
          )}
          style={{ fontSize: '14px' }}
        />

        <Divider />

        <SettingsBody title='其他设置'>
          <List
            split={false}
            renderItem={item => (
              <List.Item
                style={{ justifyContent: 'space-between' }}
                actions={[item.action]}
              >
                <span>{item.title}</span>
              </List.Item>
            )}
            dataSource={[
              {
                title: '色弱模式',
                action: (
                  <Switch
                    size='small'
                    checked={systemSettings.colorWeak}
                    onChange={value => onChange('colorWeak', value)}
                  />
                ),
              },
            ]}
            style={{ fontSize: '14px' }}
          />
        </SettingsBody>
      </Drawer>
    </>
  );
}

export default memo(LayoutSettings);
