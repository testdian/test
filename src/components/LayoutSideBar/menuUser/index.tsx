import { RightOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { noop } from 'lodash-es';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import userImage from '@/image/icon-user.png';
import I18N from '@/lang/I18N';
import { RouteMaps } from '@/router/utils/enums';
import { SupplyChainSupplierRouteMaps } from '@/router/utils/supplyChainSupplierEnums';
import { getAuthTokenLogout } from '@/sdks/authV2ApiDocs';
import { removeSideBarRoutes } from '@/store/module/systemOperations';
import { userInfoActions } from '@/store/module/user';
import { RootState } from '@/store/types';
import { BUTTON_AUTH } from '@/utils/const';
import LocalStore from '@/utils/store';
import { supplierName } from '@/views/supplyChainCarbon/data/demo-data';
import { useDemoStore } from '@/views/supplyChainCarbon/hooks/useDemoStore';
import {
  ROLE_INFO,
  useUserRole,
  type UserRole,
} from '@/views/supplyChainCarbon/hooks/useUserRole';
import { USER_TYPE } from '@/views/dashborad/Users/constant';

import styles from './index.module.less';

const LogOutFlag = 'logout';

const isExternalUserType = (userType?: number | string) =>
  `${userType}` === USER_TYPE.EXTERNAL;

const getSidebarDisplayName = ({
  username,
  realName,
  userType,
}: {
  username?: string;
  realName?: string;
  userType?: number | string;
}) => {
  const isExternalUser =
    isExternalUserType(userType) ||
    (!!realName && !!username && realName !== username);

  if (isExternalUser) {
    return username || '-';
  }

  return username || realName || '-';
};

const MenuUserPopover: React.FC = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const { username, realName, userType } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const { role, setRole, isAdmin, supplierId, roleLabel, isLoaded } =
    useUserRole();
  const { data, ready } = useDemoStore();

  const displayName = useMemo(() => {
    if (!isLoaded) {
      return getSidebarDisplayName({ username, realName, userType });
    }
    if (!isAdmin && ready && supplierId > 0) {
      return supplierName(data, supplierId);
    }
    if (!isAdmin) {
      return roleLabel;
    }
    return getSidebarDisplayName({ username, realName, userType });
  }, [
    data,
    isAdmin,
    isLoaded,
    ready,
    roleLabel,
    supplierId,
    username,
    realName,
    userType,
  ]);

  const onMenuClick = useCallback(({ key }: { key: string }) => {
    if (key === LogOutFlag) {
      getAuthTokenLogout({}).catch(noop);
      setTimeout(() => {
        dispatch(userInfoActions.clearUserInfo());
        dispatch(removeSideBarRoutes());
        LocalStore.removeValue(BUTTON_AUTH);
        history(RouteMaps.login);
      });
    }
  }, [dispatch, history]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      history(RouteMaps.home);
    } else {
      history(SupplyChainSupplierRouteMaps.workbench);
    }
  };

  return (
    <div className={styles.menuUser}>
      <Popover
        placement='rightBottom'
        content={
          <div className={styles.rolePopover}>
            <div className={styles.rolePopoverTitle}>切换身份</div>
            {(Object.keys(ROLE_INFO) as UserRole[]).map(item => (
              <div
                key={item}
                className={`${styles.roleOption}${
                  role === item ? ` ${styles.roleOptionActive}` : ''
                }`}
                onClick={() => switchRole(item)}
              >
                {ROLE_INFO[item].label}
              </div>
            ))}
            <div className={styles.rolePopoverDivider} />
            <div
              className={styles.logoutAction}
              onClick={() => onMenuClick({ key: LogOutFlag })}
            >
              <span>{I18N.utils.LogOut}</span>
            </div>
          </div>
        }
        trigger='click'
        arrow={false}
      >
        <div className={styles.profileContainer}>
          <div className={styles.userInfo}>
            <div className={styles.userInfoContent}>
              <img width={24} height={24} src={userImage} alt='user' />
              <span className={styles.username}>{displayName}</span>
            </div>
            <RightOutlined style={{ fontSize: 12 }} />
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default MenuUserPopover;
