/**
 * @description 左上角logo
 */
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { ModifyNote } from '@/components/ModifyNote';

import './index.less';

const Logo = () => {
  return (
    <div className={classnames('layout__side-bar-logo-wrap')}>
      <Link to='/' className='layout__side-bar-link'>
        <div className='layout__side-bar-title-wrap'>
          <h1 className='layout__side-bar-title'>test</h1>
          <ModifyNote content='test' />
        </div>
      </Link>
    </div>
  );
};

export default Logo;
