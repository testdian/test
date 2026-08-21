import React from 'react';

import styles from './newLayout.module.less';
import Logo from '../SidebarLogo';

const NewLayoutHeader: React.FC = () => {
  return (
    <div className={styles.newLayoutHeader}>
      <Logo />
    </div>
  );
};

export default NewLayoutHeader;
