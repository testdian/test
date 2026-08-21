import I18N from '@src/lang/I18N';
import React from 'react';

import Logo from '@/components/SidebarLogo';

import styles from './index.module.less';

const LoginError: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <span className={styles.createAccount}>
            {I18N.base.welcomeToLogInL}
          </span>
        </div>
        <div className='baseText16Color666'>{I18N.base.dearUser}</div>
      </div>
    </div>
  );
};

export default LoginError;
