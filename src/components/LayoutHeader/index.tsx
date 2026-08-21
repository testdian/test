/*
 * @@description:
 */
import { useInterval } from 'ahooks';
import { Badge, Dropdown } from 'antd';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useTableRef as useTable } from '@/components/x-render/TableRender/hook/useTableRef';
import { RouteMaps } from '@/router/utils/enums';
import { getSystemMsgPage, Msg } from '@/sdks_v2/new/systemV2ApiDocs';
import {
  getUnreadNumFn,
  msgClickFn,
  readAllFn,
} from '@/store/action/noticeAction';

import Style from './index.module.less';
import { IStoreState } from '../../store/types';
import { IconFont } from '../IconFont';
import LayoutNavBar from '../LayoutNavBar';
import { DropdownMessage } from '../NoticeMessage';
import Logo from '../SidebarLogo';

// 定义一个函数用于渲染下拉菜单内容

export const LayoutHeader = () => {
  const selector = useSelector<IStoreState, IStoreState>(state => state);
  const { layout, theme, fixedHeader } = selector.systemSettings;
  // 表格刷新
  const { refresh } = useTable();

  const navigate = useNavigate();
  // 消息列表
  const [message, setMessage] = useState<Msg[]>([]);
  /**
   *  控制消息弹窗
   * **/
  const [isOpen, setIsOpen] = useState(false);
  /**
   * 消息列表-分页 最多展示五条
   * */
  const getMsgPageFn = async () => {
    const { data } = await getSystemMsgPage({
      pageNum: 1,
      pageSize: 5,
    });
    setMessage([...(data?.data?.list || [])]);
  };
  /**
   * 全部已读的回调
   * **/
  const allReadFn = async () => {
    // 更新消息中心列表
    readAllFn(refresh);
    refresh?.({ stay: false, tab: 0 });
  };
  /** *
   * 查看更多的方法
   */
  const showAllFn = () => {
    navigate(`${RouteMaps.message}?pageNum=1&pageSize=10`);
  };
  /**
   * 首次请求信息接口 防止页面空白
   *
   * **/
  useEffect(() => {
    if (location.pathname !== '/pwd-change') {
      // 如果用户没有修改密码 所有后端接口会报错
      getMsgPageFn();
    }
  }, []);
  /**
   *  使用 useEffect 来设置定时器
   *
   */
  const intervalCallback = () => {
    if (location.pathname !== '/pwd-change') {
      // 如果用户没有修改密码 所有后端接口会报错
      getUnreadNumFn();
    }
  };
  useInterval(
    () => {
      intervalCallback();
    },
    5000,
    {
      immediate: true,
    },
  );
  return (
    <header
      className={classnames(Style.layoutheader, {
        [Style.layoutheaderSide]: layout === 'side',
        [Style.layoutheaderLight]: theme === 'light',
        [Style.layoutheaderfix]: fixedHeader,
        // [Style.layoutHeaderClose]: !sidebar.opened && layout === 'side',
      })}
    >
      <div className={Style.logo}>
        <Logo />
      </div>

      <div
        className={classnames(Style.layoutheaderInner, {
          [Style.layoutheaderInnerFixed]: layout === 'top',
        })}
      >
        {/* <SelectLanguage /> */}
        <div className={Style.layoutheaderMenuTracker}>
          <div
            className={classnames(Style.toolsicon, {
              [Style.toolsiconOpen]: isOpen,
            })}
            onClick={e => {
              e.stopPropagation();
              setIsOpen(!isOpen);
              if (!isOpen) {
                getMsgPageFn();
              }
            }}
          >
            <Dropdown
              open={isOpen}
              trigger={['click']}
              placement='bottomRight'
              overlay={
                <DropdownMessage
                  message={[...message]}
                  onClickFn={item => {
                    msgClickFn(item, setIsOpen, () => {
                      getMsgPageFn(); // 消息列表
                      getUnreadNumFn(); // 未读数量
                    });
                  }}
                  allReadFn={e => {
                    e.stopPropagation();
                    allReadFn();
                    setIsOpen(false);
                  }}
                  showAllFn={e => {
                    e.stopPropagation();
                    showAllFn();
                    setIsOpen(false);
                  }}
                />
              }
              onOpenChange={open => {
                setIsOpen(open);
              }}
            >
              <Badge
                count={selector.systemNotices.count || 0}
                overflowCount={99}
                size='small'
                className={Style.badge}
              >
                <IconFont className={Style.iconfont} icon='icon-icon-xiaoxi' />
              </Badge>
            </Dropdown>
          </div>
        </div>
        <LayoutNavBar />
      </div>
    </header>
  );
};
